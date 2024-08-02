import { useReducer, useEffect } from "react";
import { nanoid } from "nanoid";
import './Todo.css'; 

const initialState = {
    todos: JSON.parse(localStorage.getItem('todos')) || [],
    inputValue: ""
};

const Actions = {
    set_input_value: "set_input_value",
    clear_input_value: "clear_input_value",
    add_todo: "add_todo",
    delete_todo: "delete_todo",
    toggle_todo: "toggle_todo"
};

const reducer = (state, action) => {
    switch (action.type) {
        case Actions.set_input_value:
            return { ...state, inputValue: action.payload };

        case Actions.clear_input_value:
            return { ...state, inputValue: "" };

        case Actions.add_todo:
            return {
                ...state,
                todos: [...state.todos, action.payload],
                inputValue: ""
            };

        case Actions.delete_todo:
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload)
            };

        case Actions.toggle_todo:
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, isCompleted: !todo.isCompleted }
                        : todo
                )
            };

        default:
            return state;
    }
};

const TodoApp = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(state.todos));
    }, [state.todos]);

    return (
        <div className="todo-container">
            <input
                type="text"
                value={state.inputValue}
                onChange={(event) => {
                    dispatch({ type: Actions.set_input_value, payload: event.target.value });
                }}
            />
            <button
                onClick={() => {
                    dispatch({
                        type: Actions.add_todo,
                        payload: { id: nanoid(), todoText: state.inputValue, isCompleted: false }
                    });
                }}
            >
                ADD
            </button>

            <br />
            <br />
            <br />

            {state.todos.length > 0 ? (
                <ul>
                {state.todos.map((todo) => (
                <li key={todo.id}>
                    <input type="checkbox" checked={todo.isCompleted} onChange={() => dispatch({ type: Actions.toggle_todo, payload: todo.id })}/>
                    <span style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}>
                        {todo.todoText}
                    </span>
                    <button className="delete" onClick={() => dispatch({ type: Actions.delete_todo, payload: todo.id })}>
                        Delete
                    </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <h4>There are no todos yet...</h4>
            )}
        </div>
    );
};

export default TodoApp;
