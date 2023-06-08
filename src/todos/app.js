
import html from './app.html?raw'
import todoStore, {Filters} from '../store/todo.store';
import { renderTodos } from './uses-cases/render-todo';
import { renderPendig } from "./uses-cases";

const ElementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',

}

/**
 * 
 * @param { String } elementId 
 */

export const App = ( elementId ) => {

    const displayTodos = () =>{
        const todos = todoStore.getTodos( todoStore.getCurrentFilter());
        console.log( todos );
        renderTodos( ElementIDs.TodoList, todos );
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPendig( ElementIDs.PendingCountLabel );
    }


    // Cuando la funcion App() se llama
    (() =>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayTodos( );

    })();
//* La funcion autoinvocada se usa porque se quiere colocar funciones y se necesita que la app este creada para
//* poder hacer referenca a elementos HTML de ahi, tmb por encapsulamiento y scope.

    //Referenicas HTML, se cra despues de la funcion sincrona que crea la estructura HTML.

    const newDescriptionInput = document.querySelector( ElementIDs.NewTodoInput );
    const todoListUL = document.querySelector( ElementIDs.TodoList );
    const clearCompletedButton = document.querySelector ( ElementIDs.ClearCompleted );
    const filtersLIs = document.querySelectorAll( ElementIDs.TodoFilters );


    //Listeners

    newDescriptionInput.addEventListener('keyup', ( event ) => {

        if ( event.keyCode !== 13 ) return; //cualquier tecla me va sacar de aqui solo si es 13(enter) va continuar

        if ( event.target.value.trim().length === 0 ) return; // si no hay nada escrito finaliza el programa

        todoStore.addTodo( event.target.value ); // si paso los dos filtros se debe continuar
        displayTodos();

        event.target.value = '';

        // console.log( event );
        // console.log( event.target.value );
    });


    todoListUL.addEventListener('click', (event) =>{

        const element = event.target.closest('[data-id]'); // basca el elemento HTML mas cercano que tenga ese atributo 
        todoStore.toggleTodo(element.getAttribute('data-id')); //Obtiene el atributo indicado

        displayTodos();
    });


    todoListUL.addEventListener('click', (event) =>{

        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');

        if ( !element || !isDestroyElement ) return; //si element no existe o si no esta en true el destroy, salgo

        todoStore.deleteTodo(element.getAttribute('data-id')); 
        displayTodos();
    });


    clearCompletedButton.addEventListener('click', () => {

        todoStore.deleteCompleted();
        displayTodos();

    });

    filtersLIs.forEach( element => {
        element.addEventListener('click', (element) =>{
            filtersLIs.forEach( el => el.classList.remove( 'selected' ));
            element.target.classList.add('selected');

            switch (element.target.text){
                case 'Todos':
                    todoStore.setFilter( Filters.All );
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending );
                    break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed );
                    break;
            }
            displayTodos();
        });
    });


}


//* Store, la idea es que cuando nuestro componentes o piezas que van a construir la app, necesiten informacion
//* en vez de recurrir al padre o salten al DOM para buscar la informacion, la puedan buscar en un espacio
//* reservado que tenemos que se llama Store.

//* Por lo general las constantes globales (o al dentro del scope del archivo) se suelen colocar todo en mayusculas, 
//* para clases e interfaces UpperCamelCasel y variable camelCase. Tal como dices no es obligatorio pero es una 
//* convención.

//? LOCAL STORAGE

//* El local storage es peristente a lo largo de todo el tiempo que viva la app. Si se regresa en 1 dia 2 dias o meses
//* y la pc no se ha formateado, siempre se va tener la informacion ahi, siemopre y cuando se corra la app en el mismo
//* host o lugar.

//? SESIN STORAGE

//* Funciona exactamente igual con la unica diferencia que cuando cerremos todas las intancias del navagegaso
//* o se apage la PC y la volvemos a encender todo se pierde.

//* Para trabajar con ambos solo se usa la API que viene en el navegadr web

//? COOKIES

//* Hay menos espacio para poder grabar informacion en las cookies, en el local storage depende del navegador
//* puede ser hasta 50 mb.

//* Con las cookies hay menos de 1 mb osea 100k, esto porque las cookies viajas automaticamnete hacia las peticiones
//* hhtp de los servidores, cuando hacemos cualquier peticion.