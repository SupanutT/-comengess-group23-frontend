const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const getUserID = async () => {
  const options = {
    method: "GET",
    credentials: "include"
  }

  let userID = '';

  await fetch(`http://${backendIPAddress}/courseville/get_profile_info`, options)
    .then((response) => response.json())
    .then((data) => {
      userID = data.user.id
    })
    .catch((err) => console.error(err))

  return userID
}


const getCoursesFromMCV = async () => {
  const options = {
    method: "GET",
    credentials: "include"
  }

  await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
    .then((response) => response.json())
    .then((data) => {
      data.data.student
        .filter(courses => courses.year == 2022 && courses.semester == 2)
        .map((courses) => {
          courseData[courses.cv_cid] = { course_no: courses.course_no }
        })
    })
    .catch((err) => console.log(err));

    for (let cv_cid in courseData) {
      await getCourseDetailFromMCV(cv_cid)
    }

};

const getCourseDetailFromMCV = async (cv_cid) => {
  const options = {
    method: "GET",
    credentials: "include"
  }
  await fetch(`http://${backendIPAddress}/courseville/get_courses/${cv_cid}`, options)
    .then((response) => response.json())
    .then((data) => {
      courseData[cv_cid].title = data.data.title
    })
    .catch((err) => console.log(err));
}

const getAssignmentsFromMCV = async (cv_cid) => {
  const options = {
    method: "GET",
    credentials: "include"
  }

  const assignmentData = {}
  await fetch(`http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`, options)
    .then((response) => response.json())
    .then((data) => {
      data.data
        .map((data) => { assignmentData[data.itemid] = data.title })
    })
    .catch((err) => console.log(err))

  return assignmentData
};

const getItemidsFromMCV = async (itemid) => {
  const options = {
    method: "GET",
    credentials: "include"
  }

  let info = {}

  await fetch(`http://${backendIPAddress}/courseville/get_assignment_detail/${itemid}`, options)
    .then((response) => response.json())
    .then((data) => { info = data.data })
    .catch((err) => console.log(err))

  return info
}

const addNewItemsFromMCV = async () => {
  let newItemids = [];
  let courseNums = Object.keys(courseData).length
  let assignmentNums = 0
  loadingInfo.innerHTML = `Fetching ${assignmentNums} assignment from ${courseNums} courses`
  for (let cv_cid in courseData) {
    let assignmentData = await getAssignmentsFromMCV(cv_cid)
    for (let itemid in assignmentData) {
      assignmentNums++
      loadingInfo.innerHTML = `Fetching ${assignmentNums} assignments from ${courseNums} courses`
      newItemids.push(itemid)
      if (!itemidsFromDB.includes(itemid)) {
        await updateItemidsInDB(newItemids);
        let assignmentInfo = await getItemidsFromMCV(itemid)
        let status = "all"
        if (Date.now() - assignmentInfo.duetime * 1000 > 0) {
          status = "deleted"
        }
        await addItemToDB(
          itemid,
          assignmentInfo.title,
          cv_cid,
          courseData[cv_cid].course_no,
          assignmentInfo.duetime,
          status
        )
      }
    }
  }
  await updateItemidsInDB(newItemids);
}

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};
