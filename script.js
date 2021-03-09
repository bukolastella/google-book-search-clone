"use strict";
const button = document.querySelector("button");
const firstPage = document.querySelector(".first-page");
const renderSection = document.querySelector(".render");
const secondPage = document.querySelector(".second-page");
const searchInput = document.querySelector(".search-input");
const googleDown = document.querySelector(".google-down");
const viewSelect = document.querySelector(".view");
const documentSelect = document.querySelector(".document");
const relevance = document.querySelector(".relevance");
const select = document.querySelector(".select");
const clear = document.querySelector(".clear");
const sectionFooter = document.querySelector(".section-footer");
const count = document.querySelector(".count");
let searchvalue, currentPage, country;

function view(ev) {
  if (ev.accessInfo.viewability == "ALL_PAGES")
    return `<div> <a href="#"><i class="fas fa-file-alt"></i>  Full view </a> </div>`;
  if (ev.accessInfo.viewability == "NO_PAGES") return "";
  if (ev.accessInfo.viewability == "PARTIAL")
    return `<div> <a href="#"><i class="fas fa-file-alt"></i> Preview </a> </div>`;
}
const google = async function (api) {
  try {
    const res = await fetch(api);
    const data = await res.json();
    country = data.items[0].saleInfo.country.toLocaleString();

    //   console.log(data.items.map((r) => r.volumeInfo.publishedDate));

    const html = data.items
      .map(
        (ev) => `
    <div class="row">
        <div class="left">
          <a href="${ev.volumeInfo.previewLink}"> <img src=${
          ev.volumeInfo.imageLinks
            ? ev.volumeInfo.imageLinks.thumbnail
            : "no iomage found"
        } alt="${
          !ev.volumeInfo.imageLinks ? "no image found" : "book image"
        }" />
      
       </a>
        </div>
        <div class="right">
          <a href="${
            ev.volumeInfo.previewLink
          }">books.google.com.ng <span>› books</span> </a>
          <div class="title">
            <a href="${ev.volumeInfo.previewLink}">
              ${ev.volumeInfo.title}
              ${ev.volumeInfo.subtitle ? `: ${ev.volumeInfo.subtitle}` : ""}
            </a>
          </div>
          <div class="author"><a href="${ev.volumeInfo.previewLink}">${
          ev.volumeInfo.authors ? ev.volumeInfo.authors.map((curr) => curr) : ""
        }</a>       <span class="date">   ${
          ev.volumeInfo.publishedDate
            ? `. 
        ${ev.volumeInfo.publishedDate.split("-")[0]}`
            : ""
        }</span>
          <span class="no-preview">  ${
            ev.accessInfo.viewability == "NO_PAGES" ? "· No preview" : ""
          }</span>
          </div>
          <p>
          ${ev.searchInfo ? ev.searchInfo.textSnippet : ""}
          </p>
          <div class="down-btn">
            
              ${view(ev)}
           
            <div>
              <a href="${ev.volumeInfo.previewLink}">
                <i class="fas fa-angle-double-right"></i>More edition</a
              >
            </div>
          </div>
        </div>
      </div>
  `
      )
      .join("");
    renderSection.innerHTML = "";
    renderSection.insertAdjacentHTML("afterbegin", html);
    sectionFooter.style.display = "block";
    count.textContent = country;
  } catch (err) {
    // console.log(err);
    const html = `<section class="error">
    <span
      >Your search - <b class="word">${searchvalue}</b> - did not match any book
      results. Reset search tools</span
    >
    <div>Suggestions:</div>
    <ul class="ul">
      <li class="li">Make sure that all words are spelled correctly.</li>
      <li class="li">Try different keywords.</li>
      <li class="li">Try more general keywords.</li>
      <li class="li">Try fewer keywords.</li>
    </ul>
  </section>`;
    renderSection.innerHTML = "";
    renderSection.insertAdjacentHTML("afterbegin", html);
    googleDown.style.display = "none";
    if (renderSection.innerHTML != "") {
      sectionFooter.style.display = "block";
      sectionFooter.style.position = "absolute";
      sectionFooter.style.bottom = "0rem";
      count.textContent = country;
    }
  }
};
const searchInput2 = document.querySelector(".search-input2");
button.addEventListener("click", function (e) {
  e.preventDefault();
  searchvalue = searchInput.value;
  searchInput.value = "";
  if (!searchvalue) return;
  firstPage.style.display = "none";
  secondPage.style.display = "block";
  renderSection.style.display = "block";
  searchInput2.value = searchvalue;
  google(`https://www.googleapis.com/books/v1/volumes?q=${searchvalue}`);
});
const to = document.querySelector(".search2");
to.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!searchInput2.value) return;
  google(`https://www.googleapis.com/books/v1/volumes?q=${searchInput2.value}`);
  searchvalue = searchInput2.value;
});

currentPage = 1;
googleDown.addEventListener("click", async function (e) {
  if (!e.target.closest("[data-index]")) return;
  let data = e.target.closest("[data-index]").dataset.index;
  document.querySelector(".active").className = "not-active";
  const circle = e.target.closest("[data-index]").querySelector("span");
  circle.className = "active";
  if (data == "next") {
    data = currentPage + 1;
    currentPage = data;
    const start = (data - 1) * 10;
    await google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=${start}&maxResults=10`
    );
  } else {
    currentPage = data;
    const start = (data - 1) * 10;
    await google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=${start}&maxResults=10`
    );
  }
  document.documentElement.scrollTop = 0;
});

viewSelect.addEventListener("click", function () {
  console.log(viewSelect.selectedIndex);
  if (viewSelect.selectedIndex == 0)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10`
    );
  if (viewSelect.selectedIndex == 1)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10&filter=partial`
    );
  if (viewSelect.selectedIndex == 2)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10&filter=full`
    );
});

documentSelect.addEventListener("click", function () {
  if (documentSelect.selectedIndex == 0)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10`
    );
  if (documentSelect.selectedIndex == 1)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10&printType=books`
    );
  if (documentSelect.selectedIndex == 2)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10&printType=magazines`
    );
});
relevance.addEventListener("click", function () {
  if (relevance.selectedIndex == 0)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10`
    );
  if (relevance.selectedIndex == 1)
    google(
      `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10&orderBy=newest`
    );
});
clear.style.display = "none";
select.addEventListener("change", function () {
  clear.style.display = "inline";
});
clear.addEventListener("click", function () {
  google(
    `https://www.googleapis.com/books/v1/volumes?q=${searchvalue}&startIndex=0&maxResults=10`
  );
  clear.style.display = "none";
  documentSelect.selectedIndex = 0;
  relevance.selectedIndex = 0;
  viewSelect.selectedIndex = 0;
});
