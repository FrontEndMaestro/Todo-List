
import "./styles.css"
import { format, addDays, differenceInDays, isWeekend } from 'date-fns';
import { todo } from "./todo";
import { project as projectClass } from "./project";

function uiController() {
    const addTask = document.querySelector(".addtask");
    const todoBoard = document.querySelector(".maincontent");
    const cancel = document.querySelector("dialog>form .cancel");
    const dialog = document.querySelector("dialog");
    const titleinput = document.querySelector("dialog form>input");
    const descriptioninput = document.querySelector("dialog form #description")
    const submitNewTask = document.querySelector("form .submit")
    submitNewTask.disabled = true;
    const dateinput = document.querySelector("#date-picker")
    const priorityinput = document.querySelector("dialog form .form-wrapper #priority")
    const project = document.querySelector("dialog form #addtoproject")
    const today = document.querySelector(".sidebar .today")
    const upcomingTasks = document.querySelector(".sidebar .upcoming")
    const addproject = document.querySelector(".sidebar .projects .myprojects")
    const projectDialog = document.getElementById("projectDialog");
    const closeDialog = document.getElementById("closeDialog");
    const projectInput = document.querySelector(".projectInput")
    const projectSubmit = document.querySelector("#submitProject")
    const projectList = document.querySelector(".project-list");



    //avoid selecting past dates with date input in dialog
    const todaydate = new Date().toISOString().slice(0, 10);
    dateinput.setAttribute("min", todaydate);

    const AllProjects = [];
    const AllTasks = [];
    let taskIndex;
    const defaultProject = new projectClass('Personal');
    let isUpdating = false;
    AllProjects.push(defaultProject)
    DisplayProjects()

    const task1 = new todo("Finish Report", "Complete the monthly sales report", "2025-03-10", "high");
    const task2 = new todo("Grocery Shopping", "Buy vegetables, milk, and eggs", "2025-03-05", "medium");
    const task3 = new todo("Gym Session", "Leg day workout at 6 PM", "2025-03-07", "high");
    const task4 = new todo("Birthday Party", "Plan Jake's surprise birthday party", "2025-03-15", "low");
    const task5 = new todo("Study JavaScript", "Review closures and async functions", "2025-03-12", "high");
    AllTasks.push(task1)
    AllTasks.push(task2)
    AllTasks.push(task3)
    AllTasks.push(task4)
    AllTasks.push(task5)
    defaultProject.addtoproject(task1)
    defaultProject.addtoproject(task2)
    defaultProject.addtoproject(task3)
    defaultProject.addtoproject(task4)
    defaultProject.addtoproject(task5)

    upcomingTasks.addEventListener('click', () => {
        upcomingTasks.classList.add('active');
        displayAllTasks();
    })
    upcomingTasks.click()

    today.addEventListener('click', () => {
        upcomingTasks.classList.remove('active');
        DisplayTodayTasks()

    })

    function DisplayTodayTasks() {
        todoBoard.innerHTML = ''
        AllTasks.forEach((element, index) => {
            if (element.date === todaydate) {
                createCard(element.title, element.description, element.date, element.priority, element, index);
            }
        })
    }

    const elementsArray = document.querySelectorAll("dialog form>input ,#date-picker,dialog form .form-wrapper #priority")

    //disabling add button if title is empty 
    const validate = () => {
        if (isUpdating === false && document.querySelector("dialog form>input").value == "" || !dateinput.value || priorityinput.value === "labeler") {
            submitNewTask.disabled = true;
        }
        else {
            submitNewTask.disabled = false;
        }
    }
    elementsArray.forEach(element => {
        element.addEventListener("input", validate)
    })


    addproject.addEventListener("click", () => {
        projectDialog.showModal()

    })
    closeDialog.addEventListener('click', () => {
        projectInput.value = ""
        projectDialog.close()
    })
    projectSubmit.addEventListener("click", () => {
        if (!projectInput.value.trim()) {
            projectInput.reportValidity();
        }
        else {

            const copystring = projectInput.value[0].toUpperCase() + projectInput.value.slice(1)
            const newProject = new projectClass(copystring);
            AllProjects.push(newProject)
            closeDialog.click()

        }
        DisplayProjects();

    })

    function DisplayProjects() {
        projectList.innerHTML = ""
        for (let i = 1; i < project.length; i++) {
            project[i].remove;
        }

        AllProjects.forEach(element => {

            const li = document.createElement("button");
            li.textContent = element.title;
            projectList.appendChild(li);
            if (element.title != 'Personal') {
                project.options[project.options.length] = new Option(`${element.title}`, `${element.title}`)
            }
        })
        const projectButtons = projectList.querySelectorAll("*")
        projectButtons.forEach(element => {
            element.addEventListener("click", (event) => {
                DisplayProjectTasks(event.target.textContent);

            })
        })

    }

    function DisplayProjectTasks(projectTitle) {
        todoBoard.innerHTML=""
        AllProjects.forEach((project) => {
            if (project.title === projectTitle) {
                project.tasks.forEach((element)=>{
                    let index=AllTasks.findIndex(t=>t.title===element.title && t.date===element.date)
                    createCard(element.title, element.description, element.date, element.priority, element, index);
                })
            }
        })

    }


    submitNewTask.addEventListener("click", (e) => {
        e.preventDefault();
        if (isUpdating == false) {

            let index = AllProjects.findIndex(element=>element.title===project.value);
            const task = new todo(titleinput.value, descriptioninput.textContent, dateinput.value, priorityinput.value)
            AllProjects[index].addtoproject(task);
            //AllProjects[index].addtoproject(task)
            console.log(AllProjects[index])

            AllTasks.push(task);
            
            cancel.click();
            upcomingTasks.focus()
        }
        else if (isUpdating == true && taskIndex != -1) {
            AllTasks[taskIndex].updateTodo(titleinput.value, descriptioninput.textContent, dateinput.value, priorityinput.value);
            displayAllTasks()
            console.log(AllTasks);
            isUpdating = false;
            cancel.click();
        }

        else {
            alert('error');
        }
    })

    function displayAllTasks() {
        todoBoard.innerHTML = ''
        AllTasks.forEach((element, index) => {
            createCard(element.title, element.description, element.date, element.priority, element, index);
        })
    }

    function createCard(title, description, date, priority, taskobj, index) {

        const taskCard = document.createElement('div')
        const checkbox = document.createElement("input")
        const titleWrapper = document.createElement("div")
        const editbutton = document.createElement('button')
        const deletebutton = document.createElement('button')
        editbutton.classList.add("edit-button")
        editbutton.innerHTML = "&nbsp";
        deletebutton.classList.add("delete-button")
        let monthNum = ""
        let day = ""
        const parsedDate = new Date(date);
        monthNum = format(parsedDate, 'MMMM');
        day = format(parsedDate, "dd");

        titleWrapper.classList.add("title-wrapper")
        checkbox.type = "checkbox";
        checkbox.value = "completed";
        checkbox.setAttribute('id', 'completed');
        titleWrapper.setAttribute('style', 'gap:5px; display:flex;margin-bottom: 3px;padding:7px 20px;border-bottom: 1px solid #eee; width:100%;')

        taskCard.classList.add("task-card");
        const titleHeading = document.createElement('label')
        editbutton.setAttribute("data-index", `${index}`)
        deletebutton.setAttribute("data-index", `${index}`)
        titleHeading.setAttribute('for', 'completed')
        titleHeading.setAttribute('id', 'heading')
        const descriptionCard = document.createElement('p');
        const dateCard = document.createElement("div");
        dateCard.classList.add("date-display");

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskobj.setCompleted(true);
                titleHeading.setAttribute('style', 'text-decoration: line-through;color:gray')
                dateCard.setAttribute('style', 'color:gray;')
                descriptionCard.setAttribute('style', 'color:gray;')
                editbutton.disabled = true;
                deletebutton.disabled = true;
            }
            else {
                taskobj.setCompleted(false);
                titleHeading.setAttribute('style', 'text-decoration: none;color:black')
                dateCard.setAttribute('style', 'color:black;')
                descriptionCard.setAttribute('style', 'color:black;')
                editbutton.disabled = false;
                deletebutton.disabled = false
            }
        })


        editbutton.addEventListener("click", (event) => {
            taskIndex = event.target.dataset.index;
            const clickedTask = AllTasks[taskIndex]

            titleinput.value = clickedTask.title;
            descriptioninput.textContent = clickedTask.description;
            dateinput.value = clickedTask.date;
            priorityinput.value = clickedTask.priority;
            isUpdating = true;
            dialog.showModal();

        })

        deletebutton.addEventListener('click', (event) => {
            let currentProjectTitle;
            taskIndex = event.target.dataset.index;
             
            const titleTask=AllTasks[taskIndex]
            console.log(titleTask)
            AllProjects.forEach(project=>{
                const index=project.tasks.findIndex(task=>task.title===titleTask.title)

                if(index!=-1){
                    project.tasks.splice(index,1)
                }
                currentProjectTitle=project.title
            })
            AllTasks.splice(taskIndex, 1)
            DisplayProjectTasks(currentProjectTitle);
            console.log(AllTasks)
        })

        if (priority === 'high') {
            taskCard.setAttribute('style', 'border-top:10px solid red;')
        }
        else if (priority === 'medium') {
            taskCard.setAttribute('style', 'border-top:10px solid yellow;')
        }
        else if (priority === 'low') {
            taskCard.setAttribute('style', 'border-top:10px solid green;')
        }

        titleHeading.textContent = title;
        if (date < todaydate) {
            dateCard.setAttribute('style', "color:#db0000;")
        }

        descriptionCard.textContent = description;
        dateCard.textContent = `${day} ${monthNum}`;
        titleWrapper.appendChild(checkbox);
        titleWrapper.appendChild(titleHeading);
        titleWrapper.appendChild(editbutton)
        titleWrapper.appendChild(deletebutton);
        taskCard.appendChild(titleWrapper)
        taskCard.appendChild(descriptionCard)
        taskCard.appendChild(dateCard)
        //taskCard.appendChild(line)
        todoBoard.appendChild(taskCard);
    }


    //sidebar addTask
    addTask.addEventListener("click", () => {
        upcomingTasks.classList.remove('active');
        dialog.showModal();
    })

    //dialog cancel
    cancel.addEventListener("click", (e) => {
        e.preventDefault();
        addTask.blur()
        titleinput.value = "";
        descriptioninput.textContent = "";
        dateinput.value = ""
        priorityinput.value = "labeler"
        dialog.close();
        //upcomingTasks.focus()
        displayAllTasks()
    })
    //defaultProject.displayAllTasks();
}

document.addEventListener("DOMContentLoaded", () => {
    uiController();
})
