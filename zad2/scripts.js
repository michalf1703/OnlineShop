"use strict"
let todoList = []; //declares a new array for Your todo list

const BASE_URL = "https://api.jsonbin.io/v3/b/65369a070574da7622bca6a9";
const SECRET_KEY = "$2a$10$QEem8jJt/wGqycGeFsRSFe7VST/uZ.xVek6cSbABLUF2od1.k6u3e";
const isDueDateAMatch = (from, to, dueDate) => {
    const areBothDatesProvided = from && to;
    const isAnyDateProvided = from || to;

    const isDueDateBeforeEndDate = dueDate < to;
    const isDueDateAfterStartDate = from ? dueDate > from : false;

    const isDueDateBetweenDates =
        isDueDateBeforeEndDate && isDueDateAfterStartDate;

    if (!isAnyDateProvided) {
        return true;
    }

    if (areBothDatesProvided) {
        return isDueDateBetweenDates;
    }

    if (isAnyDateProvided) {
        return isDueDateBeforeEndDate || isDueDateAfterStartDate;
    }

    return false;
};

const isSearchAMatch = (filterValue, title, description) => {
    const isFilterEmpty = filterValue === "";
    const doesTitleIncludeFilter = title.includes(filterValue);
    const doesDescriptionIncludeFilter = description.includes(filterValue);

    return (
        isFilterEmpty || doesTitleIncludeFilter || doesDescriptionIncludeFilter
    );
};

(() => {
    $.ajax({
        url: BASE_URL,
        type: "GET",
        success: (data) => {
            todoList = data.record;
        },
        error: (err) => {
            console.log(err.responseJSON);
        },
    });
})();

let updateJSONbin = function () {
    $.ajax({
        url: BASE_URL,
        type: "PUT",
        headers: {
            'X-Master-Key': SECRET_KEY
        },
        contentType: "application/json",
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        },
    });
};

// updating todos
const updateTodoList = function () {
    const todoListDiv = $("#todoListTable")[0];

    // clear todos before updating
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    const filterInput = $("#inputSearch")[0];

    // create new todos for the update
    for (const todo in todoList) {
        const from = $("#startDate")[0].value;
        const to = $("#endDate")[0].value;
        const dueDate = todoList[todo].dueDate;

        const filterValue = filterInput.value;
        const title = todoList[todo].title;
        const description = todoList[todo].description;

        // render elements only if they fit the filter value

        if (
            isSearchAMatch(filterValue, title, description) &&
            isDueDateAMatch(from, to, dueDate)
        ) {
            const newElement = $(`<tr></tr>`)
                .append($(`<td>${todoList[todo].title}</td>`))
                .append($(`<td>${todoList[todo].description}</td>`))
                .append($(`<td>${todoList[todo].place}</td>`))
                .append($(`<td>${todoList[todo].dueDate}</td>`))[0];

            newElement.append(
                $(
                    '<td><button type="submit" class="btn btn-danger pt-0">x</button><td>'
                ).click(() => {
                    deleteTodo(todoList.indexOf(todo));
                })[0]
            );

            // add new todo
            todoListDiv.append(newElement);
        }
    }
};

setInterval(updateTodoList, 1000);


const deleteTodo = function (index) {
    // remove todo
    todoList.splice(index, 1);
    updateJSONbin();

};

const addTodo = function () {
    // get the values from the form
    const newTitle = $("#inputTitle")[0].value;
    const newDescription = $("#inputDescription")[0].value;
    const newPlace = $("#inputPlace")[0].value;
    const newDate = $("#inputDate")[0].value;
    // create new Todo
    const newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate,
    };
    // add todo to the list
    todoList.push(newTodo);
    // update todos on the backend
    updateJSONbin();
};