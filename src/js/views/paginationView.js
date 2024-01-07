import icons from "url:../../img/icons.svg"; // parcel 2

import View from "./View";
import { truncateString } from "../helpers";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._rightPageButtonMarkUp(currentPage + 1);
    }

    // last page
    if (currentPage === numPages && numPages > 1) {
      return this._leftPageButtonMarkUp(currentPage - 1);
    }
    // Other page
    if (this._data.page < numPages) {
      return (
        this._leftPageButtonMarkUp(currentPage - 1) +
        this._rightPageButtonMarkUp(currentPage + 1)
      );
    }
    // page 1, and there are NO other pages
    return "";
  }

  _leftPageButtonMarkUp(num) {
    return `
    <button data-goto="${num}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${num}</span>
    </button>
    `;
  }
  _rightPageButtonMarkUp(num) {
    return `
    <button data-goto="${num}" class="btn--inline pagination__btn--next">
      <span>Page ${num}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }
}

export default new PaginationView();
