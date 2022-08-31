async function getDashboardData(url = "/data.json") {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

class DashboardItem {
  static periods = {
    daily: "day",
    weekly: "week",
    monthly: "month",
  };

  constructor(data, container = ".dashboard__content", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this._createMarkup();
  }

  _createMarkup() {
    const { title, timeframes } = this.data;

    const id = title.toLowerCase().replace(/ /g, "-");
    const { current, previous } = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML(
      "beforeend",
      `<div class="dashboard__content__item dashboard__content__item--${id}">
          <div class="tracking-card">
            <header class="tracking-card__header">
              <h4 class="tracking-card__header-title">${title}</h4>
              <img
                class="tracking-card__header-menu"
                src="/images/icon-ellipsis.svg"
                alt="menu"
              />
            </header>
            <div class="tracking-card__body">
              <div class="tracking-card__body-current-time">${current}hrs</div>
              <div class="tracking-card__body-pre-period">Last${
                DashboardItem.periods[this.view]
              } - ${previous}hrs</div>
            </div>
          </div>
        </div>`
    );
    this.time = this.container.querySelector(
      `.dashboard__content__item--${id} .tracking-card__body-current-time`
    );
    this.prev = this.container.querySelector(
      `.dashboard__content__item--${id} .tracking-card__body-pre-period`
    );
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view.toLowerCase()];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${
      DashboardItem.periods[this.view]
    } - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDashboardData().then((data) => {
    const activities = data.map((activity) => new DashboardItem(activity));

    const selectors = document.querySelectorAll(
      ".dashboard-view-selector__item"
    );
    selectors.forEach((selector) =>
      selector.addEventListener("click", function () {
        selectors.forEach((sel) =>
          sel.classList.remove("dashboard-view-selector__item--active")
        );
        selector.classList.add("dashboard-view-selector__item--active");

        const currentView = selector.innerText.trim().toLowerCase();
        activities.forEach((activity) => activity.changeView(currentView));
      })
    );
  });
});
