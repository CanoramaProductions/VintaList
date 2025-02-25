document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById("list");
    const itemType = document.getElementById("itemType");
    const inputValue = document.getElementById("inputValue");
    const searchBar = document.getElementById("searchBar");
    const creationTime = document.getElementById("creationTime");
    const updateTime = document.getElementById("updateTime");

    let data = {
        items: [],
        created: new Date().toLocaleString(),
        updated: new Date().toLocaleString(),
        theme: "default"
    };

    function saveData() {
        data.updated = new Date().toLocaleString();
        localStorage.setItem("vintalinkData", JSON.stringify(data));
        updateTime.textContent = `Last Updated: ${data.updated}`;
    }

    function loadData() {
        const savedData = localStorage.getItem("vintalinkData");
        if (savedData) {
            data = JSON.parse(savedData);
            creationTime.textContent = `List Created: ${data.created}`;
            updateTime.textContent = `Last Updated: ${data.updated}`;
            data.items.forEach(item => addItemToDOM(item));
            applyTheme(data.theme);
        } else {
            creationTime.textContent = `List Created: ${data.created}`;
            updateTime.textContent = `Last Updated: ${data.updated}`;
        }
    }

    function addItem() {
        const type = itemType.value;
        const value = inputValue.value.trim();
        const category = document.getElementById("category").value.trim() || "Uncategorized";

        if (value) {
            const item = { type, value, category };
            data.items.push(item);
            addItemToDOM(item);
            saveData();
            inputValue.value = "";
        }
    }

    function addItemToDOM(item) {
        let itemElement = document.createElement("li");
        itemElement.dataset.category = item.category;

        if (item.type === "text") {
            itemElement.textContent = item.value;
        } else if (item.type === "link") {
            const link = document.createElement("a");
            link.href = item.value.startsWith("http") ? item.value : `https://www.${item.value}`;
            link.textContent = item.value;
            link.target = "_blank";
            itemElement.appendChild(link);
        } else if (item.type === "image") {
            const img = document.createElement("img");
            img.src = item.value;
            img.style.maxWidth = "200px";
            img.style.border = "2px solid #8B0000";
            itemElement.appendChild(img);
        }

        const editButton = document.createElement("span");
        editButton.textContent = " [Edit]";
        editButton.className = "edit-button";
        editButton.onclick = () => editItem(item, itemElement);

        const deleteButton = document.createElement("span");
        deleteButton.textContent = " [Delete]";
        deleteButton.className = "delete-button";
        deleteButton.onclick = () => deleteItem(item, itemElement);

        itemElement.appendChild(editButton);
        itemElement.appendChild(deleteButton);
        list.appendChild(itemElement);
    }

    function editItem(item, itemElement) {
        const newValue = prompt("Edit item:", item.value);
        if (newValue) {
            item.value = newValue;
            itemElement.childNodes[0].nodeValue = newValue;
            saveData();
        }
    }

    function deleteItem(item, itemElement) {
        const index = data.items.indexOf(item);
        if (index > -1) {
            data.items.splice(index, 1);
            list.removeChild(itemElement);
            saveData();
        }
    }

    searchBar.addEventListener("input", function() {
        const searchTerm = searchBar.value.toLowerCase();
        const items = list.getElementsByTagName("li");

        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? "" : "none";
        });
    });

    function applyTheme(theme) {
        document.body.className = theme;
        data.theme = theme;
        saveData();
    }

    window.applyTheme = applyTheme;
    window.addItem = addItem;

    loadData();
});
