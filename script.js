const tableBody = document.querySelector(".data-table tbody");
const paginationContainer = document.querySelector(".pagination");
const rowsPerPage = 8;

fetch("sample-data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    let activePageIndex = 1;

    function generateTable(startIndex) {
      tableBody.innerHTML = "";

      for (let i = startIndex; i < startIndex + rowsPerPage; i++) {
        if (i >= totalRows) break;

        const row = document.createElement("tr");

        const rowData = data[i];

        for (const key in rowData) {
          const cell = document.createElement("td");

          if (key === "Status") {
            const button = document.createElement("button");
            button.textContent = rowData[key];
            button.classList.add("button", rowData[key].toLowerCase());
            cell.appendChild(button);
          } else {
            cell.textContent = rowData[key];
          }

          row.appendChild(cell);
        }

        tableBody.appendChild(row);
      }
    }

    function generatePaginationButtons() {
      paginationContainer.innerHTML = "";

      const prevButton = createPaginationButton("<", () => {
        if (activePageIndex > 1) {
          setActivePageIndex(activePageIndex - 1);
        }
      });
      paginationContainer.appendChild(prevButton);

      for (let i = 1; i <= totalPages; i++) {
        const button = createPaginationButton(i, () => {
          setActivePageIndex(i);
        });

        paginationContainer.appendChild(button);
      }

      const nextButton = createPaginationButton(">", () => {
        if (activePageIndex < totalPages) {
          setActivePageIndex(activePageIndex + 1);
        }
      });
      paginationContainer.appendChild(nextButton);

      setActivePageIndex(1);
    }

    function setActivePageIndex(pageNumber) {
      activePageIndex = pageNumber;
      generateTable((pageNumber - 1) * rowsPerPage);
      highlightPageButton(pageNumber);
    }

    function highlightPageButton(pageNumber) {
      const pageButtons = document.querySelectorAll(".pagination button");
      pageButtons.forEach((button) => {
        button.classList.toggle(
          "current",
          button.textContent == pageNumber &&
            button.textContent !== "<" &&
            button.textContent !== ">"
        );
      });
    }

    function createPaginationButton(label, clickHandler) {
      const button = document.createElement("button");
      button.textContent = label;
      button.addEventListener("click", clickHandler);
      button.classList.add("pagination-button");
      return button;
    }

    generateTable(0);
    generatePaginationButtons();
  })
  .catch((error) => console.error("Error loading data:", error));
