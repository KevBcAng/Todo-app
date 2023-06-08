import { Todo } from "../models/todo.model";
import { createTodoHTML } from "./";

let element;

/**
 * 
 * @param {String} elmentId 
 * @param {Todo} todos 
 */

export const renderTodos = ( elementId, todos = [] ) => {

    if (!element)// convierte el undefined a true y lo evalua si es true
        element = document.querySelector( elementId );

    if ( !element ) throw new Error(`Element${ elementId } not found`);// si element no existe

    element.innerHTML = '';

    todos.forEach(todo => {
        element.append( createTodoHTML(todo) );
    });


}