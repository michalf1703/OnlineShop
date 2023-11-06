"use strict"
let todoList = []; //declares a new array for Your todo list

const BASE_URL = "https://api.jsonbin.io/v3/b/65369a070574da7622bca6a9";
const SECRET_KEY = "$2a$10$QEem8jJt/wGqycGeFsRSFe7VST/uZ.xVek6cSbABLUF2od1.k6u3e";
const isDueDateAMatch = (from, to, dueDate) => { //przyjmuje date "od", "do" oraz date zakończenia zadania
    //sprawdzenie czy obie daty zostały dostarczone przez użytkownika
    const areBothDatesProvided = from && to; //jeśli tak to wartość true
    const isAnyDateProvided = from || to; //sprawdza czy chociażby jedna data została dostarczona
//sprawdzenie czy data "do" jest późniejsza niż data zakończenia zadania
    const isDueDateBeforeEndDate = dueDate < to;
    const isDueDateAfterStartDate = from ? dueDate > from : false; //jeśli data nie została dostarczona to false

    //sprawdzenie czy data zakończenia mieści się pomiędzy wyznaczonymi datami
    const isDueDateBetweenDates =
        isDueDateBeforeEndDate && isDueDateAfterStartDate;

    //żadna z dat nie została wybrana
    if (!isAnyDateProvided) {
        return true;
    }
    //obie daty zostały wprowadzone
    if (areBothDatesProvided) {
        return isDueDateBetweenDates;
    }
    //jeżeli przynajmniej jedna data została wybrana i data zakończenia mieści się w zakresie
    if (isAnyDateProvided) {
        return isDueDateBeforeEndDate || isDueDateAfterStartDate;
    }

    return false;
};

// Funkcja isSearchAMatch przyjmuje wartość filtra oraz atrybuty tytułu, opisu i miejsca.
const isSearchAMatch = (filterValue, title, description, place) => {
    // Sprawdzamy, czy filtr jest pusty.
    const isFilterEmpty = filterValue === "";
    const doesTitleIncludeFilter = title.includes(filterValue);
    const doesDescriptionIncludeFilter = description.includes(filterValue);
    const doesPlaceIncludeFilter = place.includes(filterValue);

    // Funkcja zwraca true, jeśli filtr jest pusty lub przynajmniej jedno z pól pasuje do filtra.
    return (
        isFilterEmpty || doesTitleIncludeFilter || doesDescriptionIncludeFilter || doesPlaceIncludeFilter
    );
};

// Funkcja anonimowa wywołana natychmiast (IIFE) pobiera dane za pomocą żądania AJAX. (wykorzystane jQuery)
(() => {
    $.ajax({
        url: BASE_URL,
        type: "GET", // Wysyłamy żądanie GET.
        success: (data) => {
            // Po sukcesie żądania przypisujemy dane do zmiennej todoList.
            todoList = data.record;
        },
        error: (err) => {
            // W przypadku błędu wyświetlamy informacje w konsoli.
            console.log(err.responseJSON);
        },
    });
})();

let updateJSONbin = function () {
    // Rozpoczynamy asynchroniczne zapytanie AJAX do serwera JSONbin
    $.ajax({
        url: BASE_URL,  // Adres URL, do którego wysyłane jest zapytanie PUT
        type: "PUT",    // Typ zapytania,Put do akutalizacji danych
        headers: {
            'X-Master-Key': SECRET_KEY
        },
        contentType: "application/json",  // Określamy, że dane są w formacie JSON
        data: JSON.stringify(todoList),  // Konwertujemy listę zadań na format JSON i przekazujemy jako dane
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        },
    });
};



const updateTodoList = function () {
    //selektor $("#todoListTable")[0] używany jest do znalezienia elementu o id "todoListTable"
    //i przypisanie do zmiennej 'todoListDiv
    const todoListDiv = $("#todoListTable")[0];

    //funkcja jQuery remove(), czyszczenie kontenera
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }
    //selektor '$'
    const filterInput = $("#inputSearch")[0];

    for (const todo in todoList) {
        const from = $("#startDate")[0].value;
        const to = $("#endDate")[0].value;
        const dueDate = todoList[todo].dueDate;
        const filterValue = filterInput.value;
        const title = todoList[todo].title;
        const description = todoList[todo].description;
        const place = todoList[todo].place;

        if (
            isSearchAMatch(filterValue, title, description, place) &&
            isDueDateAMatch(from, to, dueDate)
        ) {
            //użyta metoda append do tworzenia nowego elementu <tr> i dodanie do niego innych elementów <td>
            //z wykorzystaniem znaczników temetu
            const newElement = $(`<tr></tr>`)
                .append($(`<td>${todoList[todo].title}</td>`))
                .append($(`<td>${todoList[todo].description}</td>`))
                .append($(`<td>${todoList[todo].place}</td>`))
                .append($(`<td>${todoList[todo].dueDate}</td>`))[0];
//tworzenie przycisku za pomocą jQuery, a następnie dołączane jest zdarzenie click, które wywołuje zdarzenie 'deleteTodo'
            newElement.append(
                $(
                    '<td><button type="submit" class="btn btn-danger pt-0">x</button><td>'
                ).click(() => {
                    deleteTodo(todoList.indexOf(todo));
                })[0]
            );

        //aktualizacja elementów DOM
            todoListDiv.append(newElement);
        }
    }
};

setInterval(updateTodoList, 1000);



// Funkcja deleteTodo usuwa wpis na liście o określonym indeksie.
const deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONbin();
};

//Pobieranie elementów DOM za pomocą selektorów jQuery, takich jak $("#inputTitle"), $("#inputDescription") itd
const addTodo = function () {
    const newTitle = $("#inputTitle")[0].value;
    const newDescription = $("#inputDescription")[0].value;
    const newPlace = $("#inputPlace")[0].value;
    const newDate = $("#inputDate")[0].value;
    const newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate,
    };
    todoList.push(newTodo);
    updateJSONbin();
};
