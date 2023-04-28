const backendIPAddress = "127.0.0.1:3000";

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


const getCourses = async () => {
  const options = {
    method: "GET",
    credentials: "include"
  }

  const courseData = {}
  await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
    .then((response) => response.json())
    .then((data) => {
      data.data.student
        .filter(courses => courses.year == 2022 && courses.semester == 2)
        .map((courses) => {
          courseData[courses.cv_cid] = { course_no : courses.course_no }
        })
    })
    .catch((err) => console.log(err));

  return courseData
};

const getAssignments = async (cv_cid) => {
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

const getItemAssignment = async (itemid) => {
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
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};