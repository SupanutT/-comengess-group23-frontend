var itemsData = { items : [] };
var userid = '';
var intervalId = null;
var login = false;
var userFullName = '';
var dotCounter = 0
const container = document.querySelector('.container');

window.onload = async () => {
  loader(0);
  container.style.display = "none"
  userid = await getUserID();
  console.log(userid);

  loader(1);
  await getItems(userid);
  container.style.display = "block"
  await reload();

  loader(2);
}

const reload = async () =>{
  userFullName = await getUserName();
  console.log("itemsData", itemsData)
  console.log(userFullName);
  document.getElementById("insert-name-here").innerHTML = `Logged in as <span id="your-name" onclick=logout()>${userFullName}</span>`; 
  const allBox = document.getElementsByClassName("all-box")[0];
  const ongoingBox = document.getElementsByClassName("ongoing-box")[0];
  const doneBox = document.getElementsByClassName("done-box")[0];
  const deletedBox = document.getElementsByClassName("deleted-box")[0];
  while (allBox.childElementCount!=2) {
    allBox.removeChild(allBox.lastChild);
  }
  while (ongoingBox.childElementCount!=2) {
    ongoingBox.removeChild(ongoingBox.lastChild);
  }
  while (doneBox.childElementCount!=2) {
    doneBox.removeChild(doneBox.lastChild);
  }
  while (deletedBox.childElementCount!=1) {
    deletedBox.removeChild(deletedBox.lastChild);
  }
  itemsData.items.sort((a, b) => a.due_date - b.due_date);
  const currentDate = new Date();
  itemsData.items.map((item) => {
    if(item.status=="deleted"){
      const assignmentTitle = document.createElement('button');
      assignmentTitle.className = "content-title-deleted";
      assignmentTitle.innerHTML = `<h3>${item.title}</h3>`;
      assignmentTitle.onclick = () => changeStatusDB("all", item.item_id);
      deletedBox.appendChild(assignmentTitle);
    }
    else{
      const contentBox = document.createElement('div');
      contentBox.classList = ["content-box"];
      contentBox.addEventListener('dragstart', dragStart);
      contentBox.addEventListener('dragend', dragEnd);
      contentBox.id = item.item_id
      const decorationAndDeleteButton = document.createElement("div");
      const decoration = document.createElement("div");
      decoration.id = "decoration"
      decorationAndDeleteButton.appendChild(decoration);
      const deleteButton = document.createElement('button');
      deleteButton.onclick = () => changeStatusDB("deleted", item.item_id);
      deleteButton.innerHTML = "Delete";
      deleteButton.id = "deleteButton"
      decorationAndDeleteButton.appendChild(deleteButton);
      decorationAndDeleteButton.id = "decoration-deleteButton"
      contentBox.appendChild(decorationAndDeleteButton);
      const assignmentTitle = document.createElement('h3');
      assignmentTitle.className = "content-title";
      assignmentTitle.innerHTML = `<a href="https://www.mycourseville.com/?q=courseville/worksheet/${item.cv_cid}/${item.itemid}" class="link-tag">${item.title}</a>`;
      const assignmentCourse = document.createElement('p');
      assignmentCourse.className = "content-course-name";
      assignmentCourse.innerHTML = item.course_name;
      const assignmentDuedate = document.createElement('p');
      assignmentDuedate.className = "content-due-date";
      const assignmentTimeLeft = document.createElement('p');
      assignmentTimeLeft.id = `TimeLeft-${item.itemid}`
      assignmentTimeLeft.innerHTML = 'Calculating...';

      let date = new Date(item.due_date*1000);
      let new_date = date.toLocaleString();

      assignmentDuedate.innerHTML = "Due date: "+new_date;
      contentBox.appendChild(assignmentTitle);
      contentBox.appendChild(assignmentCourse);
      contentBox.appendChild(assignmentDuedate);
      contentBox.appendChild(assignmentTimeLeft);

      const buttonOngoing = document.createElement('button');
      buttonOngoing.id = "move-to-ongoing";
      buttonOngoing.onclick = () => changeStatusDB("ongoing", item.item_id);
      buttonOngoing.innerHTML = "MOVE TO ONGOING";

      const buttonDone = document.createElement('button');
      buttonDone.id = "move-to-done";
      buttonDone.innerHTML = "MOVE TO DONE"
      buttonDone.onclick = () => changeStatusDB("done", item.item_id);

      const buttonAll = document.createElement('button');
      buttonAll.id = "move-to-all";
      buttonAll.onclick = () => changeStatusDB("all", item.item_id);
      buttonAll.innerHTML = "MOVE TO ALL";
      const buttonDiv = document.createElement('div');
      buttonDiv.className = "buttons"
      if (item.due_date*1000 < currentDate){
        contentBox.classList.add("late");
        assignmentTimeLeft.classList.add("late");
      }
      else if (item.due_date*1000 - currentDate < 86400*1000){
        contentBox.classList.add("hurry");
        assignmentTimeLeft.classList.add("hurry");
      }else if (item.due_date*1000 - currentDate < 86400*7000){
        contentBox.classList.add("sevendays");
        assignmentTimeLeft.classList.add("sevendays");
      }else{
        contentBox.classList.add("chill");
        assignmentTimeLeft.classList.add("chill");
      }
      if (item.status ==="all"){
        buttonDiv.appendChild(buttonOngoing);
        buttonDiv.appendChild(buttonDone);
        contentBox.appendChild(buttonDiv);
        allBox.appendChild(contentBox);
      }
      else if (item.status ==="ongoing"){
        buttonDiv.appendChild(buttonAll);
        buttonDiv.appendChild(buttonDone);
        contentBox.appendChild(buttonDiv);
        ongoingBox.appendChild(contentBox);
      }
      else if (item.status ==="done"){
        buttonDiv.appendChild(buttonOngoing);
        buttonDiv.appendChild(buttonAll);
        contentBox.appendChild(buttonDiv);
        doneBox.appendChild(contentBox);
      }
    }
  });
  const nothing1 = document.createElement('div');
  nothing1.innerHTML = "*there's nothing here*";
  nothing1.id = "nothing"
  if (allBox.childElementCount==2) allBox.appendChild(nothing1);
  const nothing2 = document.createElement('div');
  nothing2.innerHTML = "*there's nothing here*";
  nothing2.id = "nothing"
  if (ongoingBox.childElementCount==2) ongoingBox.appendChild(nothing2);
  const nothing3 = document.createElement('div');
  nothing3.innerHTML = "*there's nothing here*";
  nothing3.id = "nothing"
  if (doneBox.childElementCount==2) doneBox.appendChild(nothing3);
  };


//loaderfunction
const loader = (x) => {
  if(x===0){
    document.getElementById("loader").style.display = "none";
    document.getElementById("start-app").style.display = "block";
    document.getElementById("login-button").style.display = "block";
    document.getElementById("login-text").style.display = "block";
  }
  else if(x===1){
    document.getElementById("loader").style.display = "block";
    document.getElementById("start-app").style.display = "block";
    document.getElementById("login-button").style.display = "none";
    document.getElementById("login-text").style.display = "none";
  }
  else{
    document.getElementById("loader").style.display = "none";
    document.getElementById("start-app").style.display = "none";
    document.getElementById("login-button").style.display = "none";
    document.getElementById("login-text").style.display = "none";
  }
}
// //delete and reload fuction
// const deleteAndReload = async(itemid) =>{
//   await deleteItem(itemid);
//   reload();
// }

const updateTimeLeft = (item) => {
  const assignmentTimeLeft = document.getElementById(`TimeLeft-${item.itemid}`)

  const now = Math.floor(Date.now() / 1000);
  const timeLeft = item.due_date - now;
  const days = Math.floor(timeLeft / 86400); 
  const hours = Math.floor((timeLeft % 86400) / 3600); 
  const minutes = Math.floor((timeLeft % 3600) / 60); 
  const seconds = Math.floor(timeLeft % 60); 

  let textToDisplay = '';

  if (days) {
    textToDisplay = `${days} day(s), ${hours} hour(s)`
  } else if (hours) {
    textToDisplay = `${hours} hour(s), ${minutes} minute(s)`
  } else {
    textToDisplay = `${minutes} minute(s), ${seconds} second(s)`
  }

  assignmentTimeLeft.innerHTML = `Time left: ${textToDisplay}`
  if(timeLeft<0) assignmentTimeLeft.innerHTML = `Time left: <span style="color:red;">Overdue</span>`
}

var intervalId = setInterval(() => {
  itemsData.items.map((item) => {
    try {
      if(item.status!="deleted") updateTimeLeft(item);
    } catch (err) {
      console.log(err)
    }
  })
}, 1000);

var LoadingIntervalId = setInterval(() => {
  const loading_text = document.querySelector('.loading-text');
  loading_text.textContent = "Loading" + ".".repeat(dotCounter)
  dotCounter = (dotCounter + 1) % 4;
},500)

const getItems = async(userid) => {
  const assignment_db = document.getElementById('assignment-db');

  assignment_db.removeAttribute("hidden")

  let fetchedData;
  itemsData = { items : [] };

  const options = {
    method: "GET",
    credentials: "include"
  };

  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data
      data
        .filter((data) => data.userid === userid)
        .map((data) => {
          itemsData.items.push({
            item_id: data.item_id,
            itemid: data.itemid,
            cv_cid: data.cv_cid,
            title: data.title,
            course_name: data.course_name,
            due_date: data.duetime,
            status: data.status
          })
        })
    })
    .catch((error) => console.error(error));

    assignment_db.setAttribute("hidden", "hidden")
  return fetchedData
}

const postAllItems = async() => {
  loader(1);

  const container = document.querySelector('.container');
  const assignmentMCV = document.getElementById('assignment-mcv');
  const assignmentNo = document.getElementById('assignment-no');
  const courseNo = document.getElementById('course-no');

  container.style.display = "none"

  const courseData = await getCourses();
  let itemsID = []

  assignmentMCV.removeAttribute("hidden")
  assignmentNo.textContent = 0
  courseNo.textContent = Object.keys(courseData).length
  
  for (let i=0; i<itemsData.items.length; i++) {
    itemsID.push(itemsData.items[i].itemid)
  }

  for (let cv_cid in courseData) {
    let allAssignments = await getAssignments(cv_cid)
    for (let itemid in allAssignments) {
      let assignmentInfo = await getItemAssignment(itemid)
      assignmentNo.textContent = parseInt(assignmentNo.textContent) + 1
      if (Date.now() - assignmentInfo.duetime * 1000 < 5 * 24 * 60 * 60 * 1000 &&
        !(itemsID.includes(itemid))) {
        await postItem(
          itemid,
          assignmentInfo.title, 
          cv_cid,
          courseData[cv_cid].course_no,
          assignmentInfo.duetime,
          "all")
        }
      }
    }

    container.style.display = "block"
    assignmentMCV.setAttribute("hidden", "hidden")

    loader(2);

    loader(0);
    container.style.display = "none"
    userid = await getUserID();
    console.log(userid);

    loader(1);
    await getItems(userid);
    container.style.display = "block"
    await reload();

    loader(2);
  }

const postItem = async(itemid, title, cv_cid, course_name, duetime, status) => {
  const itemToAdd = {
    userid: userid,
    itemid: itemid,
    title: title,
    cv_cid: cv_cid,
    course_name: course_name,
    duetime: duetime,
    status: status
  }

  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify(itemToAdd)
  }

  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) => console.log(response))
    .catch((err) => console.log(err))
}

const deleteItem = async(item_id) => {
  const options = {
    method: "DELETE",
    credentials: "include",
  }

  await fetch(`http://${backendIPAddress}/items/${item_id}`, options)
    .then((response) => console.log(response))
    .catch((err) => console.log(err))
}

const changeStatusDB = async (status, item_id) => {
  clearInterval(intervalId)

  const options = {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify({ status : status })
  }

  await fetch(`http://${backendIPAddress}/items/${item_id}`, options)
    .then((response) => console.log(response))
    .catch((err) => console.log(err))

  await getItems(userid)
  await reload()

  intervalId = setInterval(() => {
    itemsData.items.map((item) => {
      if(item.status!="deleted") updateTimeLeft(item);
    })
  }, 1000);
  
}

const getUserName = async () => {
  let userName = '';

  const options = {
    method: "GET",
    credentials: "include"
  }

  await fetch(`http://${backendIPAddress}/courseville/get_profile_info`, options)
    .then((response) => response.json())
    .then((data) => {
      userName = data.user.firstname_en+" "+data.user.lastname_en
      console.log(data.user.firstname_en+" "+data.user.lastname_en)
      console.log(data)
    })
    .catch((err) => console.error(err))

    return userName
}

/* Utils */
const getItemsTest = async() => {
  let fetchedData;
  itemsData = { items: [] };
  const options = {
    method: "GET",
    credentials: "include"
  };
  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data
      data.map((data) => {
            console.log(data)
            itemsData.items.push({
              item_id: data.item_id,
              itemid: data.itemid,
              title: data.title,
              course_name: data.course_name,
              due_date: data.duetime,
              status: data.status
            })
          })
    })
    .catch((error) => console.error(error));
  return fetchedData
}

const deleteAll = async() => {
  let allItems = await getItemsTest();
  for (let i=0; i<allItems.length; i++) {
    await deleteItem(allItems[i].item_id)
  }
}