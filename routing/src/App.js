import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect, useMemo, useCallback, createContext } from 'react';
import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const filterContext = createContext();

function FormPage() {
const [dataSet, setDataSet] = useState('');
const [redirect, setRedirect] = useState(false);

useEffect(() => {
  if(redirect) {
    window.location.href = `/grid?${dataSet}`;
  }
}, [redirect])

const formSubmit = (e) => {
e.preventDefault();
setRedirect(true)
};

  return (
    <div>
    <h1>Form</h1>
    <form onSubmit={formSubmit}>
      <select value={dataSet} onChange={e => setDataSet(e.target.value)}>
        <option value={'Ford'}> Ford </option>
        <option value={'Porsche'}> Porsche </option>
        <option value={'Toyota'}> Toyota </option>
      </select>
      <button type='submit'>Submit</button>

    </form>
    </div>
  );
}

function GridPage() {
  const gridRef = useRef(); 
 const [rowData, setRowData] = useState();

 const filter =  window.location.href.split("?")[1];

 const [columnDefs, setColumnDefs] = useState([
   {field: 'make', filter: true},
   {field: 'model', filter: true},
   {field: 'price'}
 ]);

 const defaultColDef = useMemo( ()=> ({
     sortable: true
   }));

 useEffect(() => {
   fetch('https://www.ag-grid.com/example-assets/row-data.json')
   .then(result => result.json())
   .then(rowData => print(rowData))
 }, []);

 const print = (rowData) => {
  console.log(rowData);
  setRowData(rowData.filter((data) => data.make === filter));
 }

 const buttonListener = useCallback( e => {
   gridRef.current.api.deselectAll();
 }, []);

 return (
   <div>

     <button onClick={buttonListener}>Deselect</button>

     <div className="ag-theme-alpine" style={{width: '100%', height: '90vh', minWidth: 400, maxWidth: 570}}>

       <AgGridReact
           ref={gridRef}
           rowData={rowData}
           columnDefs={columnDefs}
           defaultColDef={defaultColDef}
           animateRows={true}
           rowSelection='multiple'
           pagination={true}
           />
     </div>
   </div>
 );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: FormPage(),
    },
    {
      path: "/grid",
      element: GridPage(),
    }
  ]);
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  );
}

export default App;
