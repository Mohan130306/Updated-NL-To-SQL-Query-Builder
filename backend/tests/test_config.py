import importlib
import os
import sys
import unittest
from pathlib import Path


class ConfigDefaultsTest(unittest.TestCase):
    def test_settings_can_load_with_defaults_for_local_dev(self):
        os.environ.pop("DATABASE_URL", None)
        os.environ.pop("SECRET_KEY", None)
        os.environ.pop("GEMINI_API_KEY", None)

        sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
        if "app.core.config" in sys.modules:
            del sys.modules["app.core.config"]

        module = importlib.import_module("app.core.config")
        self.assertEqual(module.settings.PROJECT_NAME, "NL to SQL Query Builder API")
        self.assertEqual(module.settings.ALGORITHM, "HS256")
        self.assertEqual(module.settings.ACCESS_TOKEN_EXPIRE_MINUTES, 30)


if __name__ == "__main__":
    unittest.main()
