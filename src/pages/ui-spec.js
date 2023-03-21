import "cypress-localstorage-commands";

import BasePage from "./base-pages/base-page";
import Menu from "./menu";
import SearchCase from "./search-pages/search-case-page";
import SearchItem from "./search-pages/search-item-page";
import SearchCheckIns from "./search-pages/search-checkIns-page";
import SearchCheckOuts from "./search-pages/search-checkOuts-page";
import SearchTransfers from "./search-pages/search-transfers-page";
import SearchMoves from "./search-pages/search-moves-page";
import SearchDisposals from "./search-pages/search-disposals-page";
import SearchMedia from "./search-pages/search-media-page";
import CaseView from "./view-pages/case-view-page";
import ItemView from "./view-pages/item-view-page";
import AddTaskPage from "./add-pages/add-task-page";
import SearchTasks from "./search-pages/search-tasks-page";
import SearchNotes from "./search-pages/search-notes-page";
import LoginPage from "./login_page";
import AddCasePage from "./add-pages/add-case-page";
import AddItemPage from "./add-pages/add-item-page";
import AddPersonPage from "./add-pages/add-person-page";
import PersonViewPage from "./view-pages/person-view-page";
import TaskViewPage from "./view-pages/task-view-page";
import ScanPage from "./scan-page";
import ImportPage from "./import-page";
import SearchPeoplePage from "./search-pages/search-people-page";
import UserAdminPage from "./user-admin-page";
import WorkflowsPage from "./workflows_page";
import AutoDispoPage from "./auto-dispo-page";
import DiscrepancyReportsPage from "./discrepancy-reports-page";
import UserSettingsPage from "./user-settings-page";
import StorageLocationsPage from "./locations-page";

const S = require('../fixtures/settings');
const basePage = new BasePage();
const menu = new Menu();
const login = new LoginPage();
const searchCase = new SearchCase();
const searchItem = new SearchItem();
const searchPeople = new SearchPeoplePage();
const searchCheckIns = new SearchCheckIns();
const searchCheckOuts = new SearchCheckOuts();
const searchTransfers = new SearchTransfers();
const searchMoves = new SearchMoves();
const searchDisposals = new SearchDisposals();
const searchMedia = new SearchMedia();
const caseView = new CaseView();
const itemView = new ItemView();
const personView = new PersonViewPage();
const taskView = new TaskViewPage();
const addTask = new AddTaskPage();
const searchTasks = new SearchTasks();
const searchNotes = new SearchNotes();
const addItem = new AddItemPage();
const addCase = new AddCasePage();
const addPerson = new AddPersonPage();
const scan = new ScanPage();
const importer = new ImportPage();
const userAdmin = new UserAdminPage();
const workflows = new WorkflowsPage();
const autoDispo = new AutoDispoPage();
const discrepancyReports = new DiscrepancyReportsPage();

module.exports = {
    open_base_url: e => cy.visit(S.base_url),
    app: basePage,
    menu: menu,
    login: login,
    searchCase: searchCase,
    searchItem: searchItem,
    searchPeople: searchPeople,
    searchCheckIns: searchCheckIns,
    searchCheckOuts: searchCheckOuts,
    searchTransfers: searchTransfers,
    searchMoves: searchMoves,
    searchDisposals: searchDisposals,
    searchMedia: searchMedia,
    searchTasks: searchTasks,
    storageLocations: new StorageLocationsPage(),
    searchNotes: searchNotes,
    caseView: caseView,
    itemView: itemView,
    personView: personView,
    taskView: taskView,
    addItem: addItem,
    addCase: addCase,
    addPerson: addPerson,
    addTask: addTask,
    scan: scan,
    importer: importer,
    userAdmin: userAdmin,
    userSettings: new UserSettingsPage(),
    workflows: workflows,
    autoDispo: autoDispo,
    discrepancyReports: discrepancyReports,
}
