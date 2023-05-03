var userid = '';
var login = false;
var itemsData = { items : [] };
var courseData = {};
var chatData = []
var itemidsFromDB = [];
var itemidsFromMCV = [];
var userFullName = '';
var dotCounter = 0;
var newAssignmentCount = 0;

var timeLeftIntervalId = null;
var chatIntervalId = null;
var loadingIntervalId = null;

var firstLoaded = null;
var isUserInDB = false;
var isDrag = false;

const backendIPAddress = "127.0.0.1:3000";
const container = document.querySelector('.container');
const loadingInfo = document.querySelector('.loading-info');
const closeBtn = document.getElementsByClassName("close")[0];
const popupForm = document.getElementById('chat-form')
const chatForm = document.getElementById('chat-form');
const popupBody = document.querySelector('.popup-body');
const popup = document.getElementById("popup");
const popupContent = document.querySelector('.popup-content');
const overlayAll = document.querySelector('.overlay-all');
const overlay = document.querySelector('.overlay');
const contentBoxes = document.querySelectorAll('.content-box');
const dropZones = document.querySelectorAll('.done-box, .ongoing-box, .all-box');
const dragStartAudio = document.getElementById("dragStartAudio");
const dragEndAudio = document.getElementById("dragEndAudio");
const deleteAudio = document.getElementById("deleteAudio");
const notiAudio = document.getElementById("notiAudio");