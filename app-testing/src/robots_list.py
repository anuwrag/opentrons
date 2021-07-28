"""Model for the list of robots."""
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from src.highlight import highlight


def get_robot_toggle_selector_by_name(name: str) -> tuple:
    """Get the locator tuple for a robot's toggle by name of the robot."""
    return (By.XPATH, f"//a[contains(@href,{name})]//button")


class RobotsList:
    """All elements and actions for the Robots List."""

    DEV = "dev"
    spinner: tuple = (By.CSS_SELECTOR, "svg[class*=spin]")
    header: tuple = (By.XPATH, '//h2[text()="Robots"]')
    refresh_list: tuple = (By.XPATH, '//button[text()="refresh list"]')
    no_robots_found: tuple = (By.XPATH, '//h3[text()="No robots found!"]')
    try_again_button: tuple = (By.XPATH, '//button[text()="try again"]')

    def __init__(self, driver: WebDriver) -> None:
        """Initialize with driver."""
        self.driver: WebDriver = driver

    def is_robot_toggle_active_by_name(self, name: str) -> bool:
        """Is a toggle for a robot 'on' using the name of the robot."""
        return (
            self.get_robot_toggle_by_name(name).get_attribute("class").find("_on_")
            != -1
        )

    @highlight
    def get_robot_toggle_by_name(self, name: str) -> WebElement:
        """Retrieve the Webelement toggle buttone for a robot by name."""
        toggle_locator: tuple = get_robot_toggle_selector_by_name(name)
        toggle: WebElement = WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable(toggle_locator)
        )
        return toggle

    def wait_for_spinner_invisible(self) -> None:
        """Wait for spinner to become invisible.  This should take 30 seconds."""
        WebDriverWait(self.driver, 31).until(
            EC.invisibility_of_element_located(RobotsList.spinner)
        )

    def wait_for_spinner_visible(self) -> None:
        """Wait for spinner to become visible.  This should take ~1 seconds."""
        WebDriverWait(self.driver, 2).until(
            EC.visibility_of_element_located(RobotsList.spinner)
        )

    @highlight
    def get_no_robots_found(self) -> WebElement:
        """Search without waiting for the h3 No robots found!"""
        return self.driver.find_element(*RobotsList.no_robots_found)

    @highlight
    def get_try_again_button(self) -> WebElement:
        """Find with no waiting the TRY AGAIN button."""
        return self.driver.find_element(*RobotsList.try_again_button)
