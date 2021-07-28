"""Left Menu Locators."""
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from src.highlight import highlight


class LeftMenu:
    """Locators for the left side menu."""

    def __init__(self, driver: WebDriver) -> None:
        """Initialize with driver."""
        self.driver: WebDriver = driver

    robot: tuple = (By.XPATH, '//a[contains(@href,"#/robots")]')
    protocol: tuple = (By.XPATH, '//a[contains(@href,"#/protocol")]')
    calibrate: tuple = (By.XPATH, '//a[contains(@href,"#/calibrate")]')
    more: tuple = (By.XPATH, '//a[contains(@href,"#/more")]')

    @highlight
    def get_more_button(self) -> WebElement:
        """Search for the More menu button."""
        return WebDriverWait(self.driver, 2).until(
            EC.element_to_be_clickable(LeftMenu.more)
        )

    def click_more_button(self) -> None:
        """Click on the more menu."""
        self.get_more_button().click()
