import { Todo } from "../todos/models/todo.model"

export const Filters = {
    All: 'all',
    Completed: 'Completed',
    Pending: 'Pending'
}

const state = {
    todos:[ 
        new Todo('Piedra del alma'),
        new Todo('Piedra del destino'),
        new Todo('Piedra del vida'),
        new Todo('Piedra del realidad'),
        new Todo('Piedra del tiempo'),
    ],
    filter: Filters.All,
}


const initStotre = () => {
    loadStore(); // carga el local storage cuando se hace f5
    console.log('InitStore 🍉');
}

const loadStore = () => {
   if ( !localStorage.getItem( 'state' ) )return; // si no existe nada entonces has reurno y termina la ejecucion

   const { todos = [], filter = Filters.All } = JSON.parse(localStorage.getItem( 'state' ))

   // Obtiene el valor almacenado asociado a una clave y con el parse convierte a una cadena JSON para poder
   // leerla, asi se puede desestructurar el objeto y reasignar valores.

   state.todos = todos;
   state.filter = filter;


}

const saveStateToLocalStorage = () => {
    // console.log( JSON.stringify(state) );
    localStorage.setItem('state', JSON.stringify(state));
}

const getTodos = ( filter = Filters.All ) => {
    switch( filter ){
        case Filters.All:
            return [...state.todos]; // Si se usa return ahi queda la ejecucion, no se necesita el brake.\

        // Si no rompemos la referencia, en caso de que en otra parte del código usemos el getTodos y modifiquemos 
        // directamente el arreglo que nos devuelve, estaríamos modificando directamente el arreglo de state.todos, 
        // es decir, no es un nuevo arreglo, es el mismo a lo largo de la app, algo que usualmente no vas a querer, 
        // ya que puedes estar usando esa data en una parte de tu app, modificarla en otra, y sin querer la has 
        // modificado en los dos lugares.
        // Al devolver un nuevo arreglo con el spread operator, evitamos modificar ese arreglo de otra parte 
        // de la app que lo estemos usando de forma involuntaria.

        case Filters.Completed:
            return state.todos.filter( todo => todo.done === true); // si la tarea esta completa, done de la imporacion
        case Filters.Pending:
            return state.todos.filter( todo => !todo.done); // Sil a tarea esta pendiente, done de la importacion.
        default:
            throw new Error(`Opcion ${ filter } is not valid`);
    }
}

/**
 * 
 * @param {String} description 
 */
const addTodo = ( description ) => {
    if ( !description ) throw new Error('Description us required');

    state.todos.push (new Todo (description) );

/* Si quieres igualmente cambiar el state de forma similar a las otras funciones puedes colocar: 
    state.todos = [ ...state.todos, new Todo(description) ];
*/

    saveStateToLocalStorage();
}

const toggleTodo = ( todoId ) => {

    state.todos =  state.todos.map( todo => {
        if ( todo.id === todoId ){
            todo.done = !todo.done
           
        }
        return todo; // Si tuvbieramos muchos todo deberiamos buscar el Todo de manera independiente usar find 
                     // cambiarlo e insertarlo en la posicion en la posicion en la que lo encontramos
    });

    saveStateToLocalStorage();
    
}

const deleteTodo = ( todoId ) => {
    state.todos = state.todos.filter( todo => todo.id !== todoId ); // regresamos todos los todos que no coincidan con ID
                                                                    // y se borra porque se reasigna al array
    saveStateToLocalStorage();                                                       
}

const deleteCompleted = ( ) => {
    state.todos = state.todos.filter( todo => !todo.done );

    saveStateToLocalStorage();
}

/**
 * 
 * @param {Filters} newFilter 
 */

const setFilter = ( newFilter = Filters.All ) =>{
    state.filter  = newFilter;
    saveStateToLocalStorage();
}

const getCurrentFilter = () =>{
   return state.filter;
}


export default{
    initStotre,
    loadStore,
    addTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    setFilter,
    getCurrentFilter,
    getTodos,
}

//* La idea aqui es que esta logica o manejador del estado se encarge de realizar todos los cambios que tenemos en
//* el estado global de la app, y asi separamos ese estado de los componentes HTML.