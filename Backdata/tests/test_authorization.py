import pytest
from app.db.models.user import User
from app.core.dependencies import verify_department_access
from app.core.exceptions import PermissionDeniedException

def test_department_isolation():
    user_dept_a = User(id="u1", email="a@mospi.gov.in", role="LEARNER", department_id="dept-A")
    user_admin_a = User(id="u2", email="admin@mospi.gov.in", role="DEPARTMENT_ADMIN", department_id="dept-A")
    user_global_admin = User(id="u3", email="sysadmin@mospi.gov.in", role="SYSTEM_ADMIN", department_id="dept-A")

    # Accessing own department should succeed
    verify_department_access(user_admin_a, "dept-A")

    # Department Admin accessing other department should raise 403 PermissionDeniedException
    with pytest.raises(PermissionDeniedException):
        verify_department_access(user_admin_a, "dept-B")

    # System Admin should be allowed cross-department access
    verify_department_access(user_global_admin, "dept-B")
