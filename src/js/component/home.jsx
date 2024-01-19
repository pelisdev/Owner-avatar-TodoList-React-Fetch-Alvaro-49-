import React, { useEffect, useState } from "react";

let URLbase = "https://playground.4geeks.com/apis/fake/todos/user/alvarosanchez"

//create your first component
const Home = () => {
	//Definimos los estados 
	//Task guarda lo escrito en el input
	const [task, setTask] = useState("");
	//Savetask guarda las tareas en un array
	const [saveTask, setSaveTask] = useState([]);

	//Llamamos la Api con su usuario y la volvemos una promesa await
	const getTask = async () => {
		try {
			let response = await fetch(URLbase)

			let data = await response.json()
			console.log(data)
			if (response.ok) {
				setSaveTask(data)
			}
			if (response.status == 404) {
				createUser()
			}
			console.log(response)

			console.log(response)
		} catch (error) {
			console.log(error)
		}
	}
	const createUser = async () => {
		try {
			let response = await fetch(URLbase, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			})

			if (response.ok) {
				getTask()
			}

			// console.log(response)
		} catch (error) {
			console.log(error)
		}
	}
	//Guarda lo que escribimos en el input (Usamos un objeto que verificamos en el navegador, el objeto es el eveto a partir del evento buscamos el valor)
	function handleTask(event) {
		setTask({
			label: event.target.value,
			done: false
		})
	}
	//Funcion que agrega tareas a la lista
	async function handleTaskList(event) {
		if (event.key == "Enter") {
			if (task.label.trim() !== "") {
				try {
					let response = await fetch(URLbase, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify([...saveTask, task])
					})
					if (response.ok) {
						getTask()
					}
				} catch (error) {
					console.log(error)
				}
			}
		}
	}
	//Funcion que borra tareas de la lista (Realmente solo filtramos)
	async function handleDelete(index) {
		let filterTask = saveTask.filter((item, indexFilter) => index !== indexFilter)
		try {
			let response = await fetch(URLbase, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(filterTask)
			})
			if (response.ok) {
				getTask()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleDeleteAll = async () => {
		try {
			let response = await fetch(URLbase, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			})
			if (response.ok) {
				setSaveTask([]); // Establece manualmente saveTask a un array vacío
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getTask()
	}, [])

	return (

		<div className="container d-flex flex-column justify-content-center"><br></br>
			<h4 className="text-center text-secondary">TO-DO LIST</h4>
			<div className="row justify-content-center">
				<div className="col-6 text-center">
					<input onChange={handleTask} value={task.label} onKeyDown={handleTaskList} className="w-100 rounded border-light fs-4 text-secondary " placeholder="Agregar Tarea" />
				</div>
			</div>
			<div className="row justify-content-center">
				<div className="col-6 ">
					<ol className="list-unstyled fs-4 ">
						{/* Esta funcion Map agrega las tareas visualmente a la lista */}
						{
							saveTask.map((item, index) => {
								return (<li className="border-bottom mt-2 ms-0  d-flex justify-content-between" key={index}>
									<span className="text-secondary ">{item.label}</span>
									<i onClick={() => handleDelete(index)} className="text-danger">Eliminar</i> </li>)
							})
						}
					</ol>
					{/* Señalamos la cantidad de tareas guardadas */}
					<p className="text-secondary ">
						{saveTask.length > 0 ? `Tienes ${saveTask.length} tareas.` : `No hay tareas pendientes`}
					</p>
					<div className="d-flex justify-content-center">
						<button className="btn btn-danger d-flex justify-content-center" onClick={handleDeleteAll}> Eliminar todas las tareas</button>
					</div>
				</div>
			</div>

		</div>
	);
};

export default Home;