"""
iGOT Learning Provider abstraction and implementations.
Provides isolated interface for querying course catalogs and learning resources.
"""

from backengine.app.igot.base import LearningProvider, CourseSummary, CourseDetail
from backengine.app.igot.mock_provider import MockLearningProvider
from backengine.app.igot.igot_provider import IGOTLearningProvider

__all__ = [
    "LearningProvider",
    "CourseSummary",
    "CourseDetail",
    "MockLearningProvider",
    "IGOTLearningProvider",
]
