import React from 'react'

import Footer from "./Footer";
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
    <div>
        <AddTodo></AddTodo>
        <VisibleTodoList></VisibleTodoList>
        <Footer></Footer>
    </div>
)
export default App