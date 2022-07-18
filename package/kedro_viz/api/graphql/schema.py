"""`kedro_viz.api.graphql.schema` defines the GraphQL schema: queries, mutations
 and subscriptions.."""
# pylint: disable=no-self-use,missing-function-docstring,missing-class-docstring

from __future__ import annotations

import asyncio
import json
import logging
from typing import AsyncGenerator, List, Optional

import strawberry
from semver import VersionInfo
from strawberry import ID
from strawberry.tools import merge_types

from kedro_viz import __version__
from kedro_viz.data_access import data_access_manager
from kedro_viz.integrations.pypi import get_latest_version, is_running_outdated_version

from .serializers import format_run, format_run_tracking_data, format_runs
from .types import (
    Run,
    RunInput,
    TrackingDataset,
    UpdateRunDetailsFailure,
    UpdateRunDetailsResponse,
    UpdateRunDetailsSuccess,
    Version,
)

logger = logging.getLogger(__name__)


@strawberry.type
class RunsQuery:
    @strawberry.field(
        description="Get metadata (blob, title, bookmark, etc.) for specified"
        " run_ids from the session store"
    )
    def run_metadata(self, run_ids: List[ID]) -> List[Run]:
        return format_runs(
            data_access_manager.runs.get_runs_by_ids(run_ids),
            data_access_manager.runs.get_user_run_details_by_run_ids(run_ids),
        )

    @strawberry.field(description="Get metadata for all runs from the session store")
    def runs_list(self) -> List[Run]:
        all_runs = data_access_manager.runs.get_all_runs()
        if not all_runs:
            return []
        all_run_ids = [run.id for run in all_runs]
        return format_runs(
            all_runs,
            data_access_manager.runs.get_user_run_details_by_run_ids(all_run_ids),
        )

    @strawberry.field(description="Get tracking datasets for specified run_ids")
    def run_tracking_data(
        self, run_ids: List[ID], show_diff: Optional[bool] = False
    ) -> List[TrackingDataset]:
        # pylint: disable=line-too-long
        tracking_dataset_models = data_access_manager.tracking_datasets.get_tracking_datasets_by_group_by_run_ids(
            run_ids
        )
        return [
            TrackingDataset(
                dataset_name=dataset.dataset_name,
                dataset_type=dataset.dataset_type,
                data=format_run_tracking_data(dataset.runs, show_diff),
            )
            for dataset in tracking_dataset_models
        ]


@strawberry.type
class Mutation:
    @strawberry.mutation(description="Update run metadata")
    def update_run_details(
        self, run_id: ID, run_input: RunInput
    ) -> UpdateRunDetailsResponse:
        run = data_access_manager.runs.get_run_by_id(run_id)
        if not run:
            return UpdateRunDetailsFailure(
                id=run_id, error_message=f"Given run_id: {run_id} doesn't exist"
            )
        updated_run = format_run(
            run.id,
            json.loads(run.blob),
            data_access_manager.runs.get_user_run_details(run.id),
        )

        # only update user run title if the input is not empty
        if run_input.title is not None and bool(run_input.title.strip()):
            updated_run.title = run_input.title

        if run_input.bookmark is not None:
            updated_run.bookmark = run_input.bookmark

        if run_input.notes is not None and bool(run_input.notes.strip()):
            updated_run.notes = run_input.notes

        data_access_manager.runs.create_or_update_user_run_details(
            run_id,
            updated_run.title,
            updated_run.bookmark,
            updated_run.notes,
        )
        return UpdateRunDetailsSuccess(updated_run)


@strawberry.type
class Subscription:
    @strawberry.subscription(description="Add new runs in real time")  # type: ignore
    async def runs_added(self) -> AsyncGenerator[List[Run], None]:
        """Subscription to new runs in real-time"""
        while True:
            new_runs = data_access_manager.runs.get_new_runs()
            if new_runs:
                data_access_manager.runs.last_run_id = new_runs[0].id
                yield [
                    format_run(
                        run.id,
                        json.loads(run.blob),
                        data_access_manager.runs.get_user_run_details(run.id),
                    )
                    for run in new_runs
                ]
            await asyncio.sleep(3)  # pragma: no cover


@strawberry.type
class VersionQuery:
    @strawberry.field(description="Get the installed and latest Kedro-Viz versions")
    def version(self) -> Version:
        installed_version = VersionInfo.parse(__version__)
        latest_version = get_latest_version()
        return Version(
            installed=installed_version,
            is_outdated=is_running_outdated_version(installed_version, latest_version),
            latest=latest_version or "",
        )


schema = strawberry.Schema(
    query=(merge_types("Query", (RunsQuery, VersionQuery))),
    mutation=Mutation,
    subscription=Subscription,
)
