// DEBUG
let debug = false

// Read widget parameters
let ref_token;
let runGoal;
let rideGoal;
let swimGoal;
let detailedGoalStatus = false;
let widgetInput;

try {
    widgetInput = args.widgetParameter.split(";");
} catch (e) {
    widgetInput = "";
}

if (config.runsInWidget && !config.runsInApp) {
    ref_token = widgetInput[0].toString()
    rideGoal = widgetInput[1].toString();
    runGoal = widgetInput[2].toString();
    swimGoal = widgetInput[3].toString();
    detailedGoalStatus = widgetInput[4].toString();
} else {
    ref_token = "..."
    rideGoal = "50"
    runGoal = "10"
    swimGoal = "10"
}

// Initialize file manager and storage file
let fileManager;
try {
    fileManager = FileManager.iCloud();
} catch {
    fileManager = FileManager.local();
}
const docDir = fileManager.documentsDirectory();
const activityStorage = fileManager.joinPath(docDir, "StravaActivityHistory.txt");
if (!fileManager.fileExists(activityStorage)) {
    fileManager.writeString(activityStorage, "");
}

// Widget colors
const colorPalette = {
    dark: {
        backColor: '1D1C21',
        brightOrange: 'FC4C02',
        lightOrange: 'FC9265',
        boxGrey: '404040',
        textColor: 'EDEDED',
        errorTextColor: 'FF0000'
    },
    light: {
        backColor: 'FFFFFF',
        brightOrange: 'FC4C02',
        lightOrange: 'FC9265',
        boxGrey: 'F2F2F2',
        textColor: '1D1C21',
        errorTextColor: 'FF0000'
    }
};

// iPhone screen res table
function deviceWidgetSizes() {
    let phones = {
        // iPhone 12 Pro Max
        "2778": {
            small: 510,
            medium: 1092,
            large: 1146,
            devices: "12 Pro Max"
        },

        // iPhone 12, 12 Pro
        "2532": {
            small: 474,
            medium: 1014,
            large: 1062,
            devices: "12, 12 Pro"
        },

        // iPhone 11 Pro Max, XS Max
        "2688": {
            small: 507,
            medium: 1080,
            large: 1137,
            devices: "12, 12 Pro"
        },

        // iPhone 11, XR
        "1792": {
            small: 338,
            medium: 720,
            large: 758,
            devices: "11, XR"
        },

        // iPhone 11 Pro, XS, X, 12 mini
        "2436": {
            small: 465,
            medium: 987,
            devices: "11 Pro, XS, X, 12 mini"
        },

        // Plus phones
        "2208": {
            small: 471,
            medium: 1044,
            large: 1071,
            devices: "iPhone [...] Plus"
        },

        // iPhone SE2 and 6/6S/7/8
        "1334": {
            small: 296,
            medium: 642,
            large: 648,
            devices: "SE2, 6, 6S, 7, 8"
        }
    }
    return phones;
}

let operatingDeviceWidgetSizes;

try {
    operatingDeviceWidgetSizes = deviceWidgetSizes()[Device.screenResolution().height];
} catch {
    errorWidget.init("Your phone is not supported yet, sorry!");
}

// Set widget dimensions
let widgetWidth;
let widgetHeight;
const widgetPresentation = config.widgetFamily;

switch (widgetPresentation) {
    case "medium":
        widgetWidth = (operatingDeviceWidgetSizes.medium / Device.screenScale());
        widgetHeight = (operatingDeviceWidgetSizes.small / Device.screenScale());
        break;
    case "large":
        widgetWidth = (operatingDeviceWidgetSizes.large / Device.screenScale());
        widgetHeight = widgetWidth;
        break;
    default:
        widgetWidth = (operatingDeviceWidgetSizes.small / Device.screenScale());
        widgetHeight = widgetWidth;
        break;
}

// Workout types
const Ride = "Ride";
const Run = "Run";
const Swim = "Swim";

// Authentication link
const auth_link = "https://www.strava.com/oauth/token";

// Calender widget class
class activityCalenderWidget {
    static init() {
        // Create widget and set padding
        let widget = new ListWidget();
        widget.backgroundColor = getColor('backColor')

        let outerPadding = 0.085 * widgetWidth;

        let componentSize;

        if (widgetPresentation === "medium") {
            componentSize = new Size((widgetWidth - 2 * outerPadding) / 2, widgetHeight - outerPadding);
        } else {
            componentSize = new Size(widgetWidth - 2 * outerPadding - 10, widgetHeight - outerPadding - 5);
        }

        // Main stack and vertical stack
        let mainStack = widget.addStack();
        let calendarStack = mainStack.addStack();
        calendarStack.layoutVertically()
        calendarStack.size = componentSize

        // Header stack
        let headerPartition = 0.25
        let headerStackHeight = headerPartition * componentSize.width
        let headerStack = calendarStack.addStack();
        let dFormatter = new DateFormatter();
        dFormatter.dateFormat = "MMMM"
        let headerText = headerStack.addText(dFormatter.string(new Date()))
        headerText.font = Font.boldSystemFont(0.83 * headerStackHeight);

        // Calender box stack
        let calendarBoxStack = calendarStack.addStack();
        let calendarBoxStackHeight = (1 - headerPartition) * componentSize.height;
        calendarBoxStack.size = new Size(componentSize.width, calendarBoxStackHeight);
        calendarBoxStack.layoutVertically();

        let dayBoxPadding = 5;
        let dayBoxWidth;
        let weekStacks = [];
        let dayStacks = {};
        let dateKey = this.getFirstDayOfMonth();

        if(widgetPresentation === "medium") {
            dayBoxWidth = (calendarBoxStackHeight - 5 * dayBoxPadding) / 5;
        } else {
            dayBoxWidth = (componentSize.width - 6 * dayBoxPadding) / 7;
        }

        let dayBoxSize = new Size(dayBoxWidth, dayBoxWidth);

        for (let i = 1; i <= this.getWeeksOfMonth(); i++) {
            weekStacks[i] = calendarBoxStack.addStack();
            if (i !== this.getWeeksOfMonth()) {
                calendarBoxStack.addSpacer(dayBoxPadding);
            }
            for (let j = 1; j <= 7; j++) {
                dayStacks[dateKey] = weekStacks[i].addStack();
                dayStacks[dateKey].size = dayBoxSize;
                dayStacks[dateKey].cornerRadius = 0.20 * dayBoxWidth;
                if (!((i === 1 && j < this.getWeekday(this.getFirstDayOfMonth())) || (i === this.getWeeksOfMonth() && j > this.getWeekday(this.getLastDayOfMonth())))) {
                    dayStacks[dateKey].backgroundColor = getColor(this.getColorForTheDay(dateKey));
                    dateKey.setDate(dateKey.getDate() + 1);
                }
                if (j !== 7) {
                    weekStacks[i].addSpacer(5)
                }
            }
        }

        // Goals stack (only if widget presentation is "medium")
        if (widgetPresentation === "medium") {

            // Goal stack initialization
            let spacer = mainStack.addStack()
            spacer.size = new Size(10, componentSize.height)

            let goalStack = mainStack.addStack();
            goalStack.layoutVertically()
            goalStack.size = componentSize

            let statusBarHeight = componentSize.height * 0.15;
            let statusBarSpacer = (componentSize.height - 6 * statusBarHeight) / 2

            if (rideGoal !== "0") {
                let totalMonthlyRideDistance = this.getTotalMonthlyDistanceForWorkout("Ride")
                let rideGoalStack = goalStack.addStack();
                rideGoalStack.layoutVertically()
                let rideGoalText = rideGoalStack.addText("RIDE");
                rideGoalText.font = Font.boldSystemFont(0.83 * statusBarHeight);
                let rideGoalStatus = rideGoalStack.addStack();
                rideGoalStatus.size = new Size(componentSize.width, statusBarHeight);
                rideGoalStatus.cornerRadius = 5
                rideGoalStatus.backgroundGradient = this.getStatusGradient(totalMonthlyRideDistance, parseInt(rideGoal));
                let rideGoalStatusText = rideGoalStatus.addText(`${Math.round(totalMonthlyRideDistance)} / ${rideGoal} km`)
                rideGoalStatusText.font = Font.boldSystemFont(0.83 * statusBarHeight)
                let rideSpacer = rideGoalStack.addStack()
                rideSpacer.size = new Size(componentSize.width, statusBarSpacer)
            }

            if (runGoal !== "0") {
                let totalMonthlyRunDistance = this.getTotalMonthlyDistanceForWorkout("Run")
                let runGoalStack = goalStack.addStack();
                runGoalStack.layoutVertically()
                let runGoalText = runGoalStack.addText("RUN");
                runGoalText.font = Font.boldSystemFont(0.83 * statusBarHeight);
                let runGoalStatus = runGoalStack.addStack();
                runGoalStatus.size = new Size(componentSize.width, statusBarHeight);
                runGoalStatus.cornerRadius = 5
                runGoalStatus.backgroundGradient = this.getStatusGradient(totalMonthlyRunDistance, parseInt(runGoal));
                let runGoalStatusText = runGoalStatus.addText(`${Math.round(totalMonthlyRunDistance)} / ${runGoal} km`)
                runGoalStatusText.font = Font.boldSystemFont(0.83 * statusBarHeight)
                let runSpacer = runGoalStack.addStack()
                runSpacer.size = new Size(componentSize.width, statusBarSpacer)
            }

            if (swimGoal !== "0") {
                let totalMonthlySwimDistance = this.getTotalMonthlyDistanceForWorkout("Swim")
                let swimGoalStack = goalStack.addStack();
                swimGoalStack.layoutVertically()
                let swimGoalText = swimGoalStack.addText("SWIM");
                swimGoalText.font = Font.boldSystemFont(0.83 * statusBarHeight);
                let swimGoalStatus = swimGoalStack.addStack();
                swimGoalStatus.size = new Size(componentSize.width, statusBarHeight);
                swimGoalStatus.cornerRadius = 5
                swimGoalStatus.backgroundGradient = this.getStatusGradient(totalMonthlySwimDistance, parseInt(swimGoal));
                let swimGoalStatusText = swimGoalStatus.addText(`${Math.round(totalMonthlySwimDistance)} / ${swimGoal} km`)
                swimGoalStatusText.font = Font.boldSystemFont(0.83 * statusBarHeight)
            }
        }


        Script.setWidget(widget)
        Script.complete()
    }

    static getColorForTheDay(date) {
        let activities = JSON.parse(fileManager.readString(activityStorage));
        let dFormatter = new DateFormatter();
        dFormatter.dateFormat = "dd.MM.yyyy"

        for (let i = 0; i < activities.length; i++) {
            if (new Date(activities[i].start_date_local) < this.getFirstDayOfMonth()) {
                break
            }
            if (dFormatter.string(new Date(activities[i].start_date_local)) === dFormatter.string(date)) {
                return "brightOrange"
            }
        }
        return "boxGrey"
    }

    static getTotalMonthlyDistanceForWorkout(workout) {
        let totalDistance = 0;
        let activities = JSON.parse(fileManager.readString(activityStorage));
        for (let i = 0; i < activities.length; i++) {
            if (new Date(activities[i].start_date_local) < this.getFirstDayOfMonth()) {
                break
            } else if (activities[i].type === workout) {
                totalDistance = totalDistance + (activities[i].distance / 1000)
            }
        }
        return Math.round(totalDistance)
    }

    static getStatusGradient(distance, goal) {
        let degreeOfGoalAchievement = distance / goal;
        let primaryProcessColor = getColor("brightOrange");
        let secondaryProcessColor = getColor("lightOrange");
        let colorBorder;

        if (degreeOfGoalAchievement <= 0.05) {
            colorBorder = 0;
        } else {
            colorBorder = degreeOfGoalAchievement - 0.01;
        }

        let statusGradient = new LinearGradient();
        statusGradient.colors = [primaryProcessColor, secondaryProcessColor, getColor("boxGrey")]
        statusGradient.locations = [0, colorBorder, degreeOfGoalAchievement]
        statusGradient.startPoint = new Point(0, 0);
        statusGradient.endPoint = new Point(1, 0);

        return statusGradient;
    }

    static getFirstDayOfMonth() {
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        return new Date(currentYear, currentMonth, 1);
    }

    static getLastDayOfMonth() {
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        return new Date(currentYear, currentMonth + 1, 0);
    }

    static getWeekday(date) {
        if (date.getDay() === 0) {
            return 7;
        } else {
            return date.getDay();
        }
    }

    static getWeeksOfMonth() {
        let days = this.getFirstDayOfMonth().getDay() + 6 + this.getLastDayOfMonth().getDate();
        return Math.ceil(days / 7) - 1;
    }
}

// Error widget class
class errorWidget {
    static init(message) {
        let widget = new ListWidget();
        let initInfo = widget.addText(message)
        initInfo.font = Font.mediumSystemFont(14)
        initInfo.textColor = getColor('errorTextColor');
        Script.setWidget(widget)
        Script.complete()
    }
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////        Widget-Functions        //////////////////////
////////////////////////////////////////////////////////////////////////////////

function getColor(colorName) {
    let lightColor = new Color(colorPalette['light'][colorName])
    let darkColor = new Color(colorPalette['dark'][colorName])
    return Color.dynamic(lightColor, darkColor)
}

async function updateActivityStorage(access_token) {
    let activities_link;
    let req;
    let onlineActivities;
    let localActivities = [];
    let localActivityIDs = [];
    let activitiesToStore = [];

    if (fileManager.fileExists(activityStorage)) {
        activities_link = `https://www.strava.com/api/v3/athlete/activities?per_page=5&access_token=${access_token}`
    } else {
        activities_link = `https://www.strava.com/api/v3/athlete/activities?per_page=100&access_token=${access_token}`
    }

    req = new Request(activities_link)

    try {
        onlineActivities = await req.loadJSON()
    } catch (error) {
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }

    if (fileManager.fileExists(activityStorage)) {
        if (!fileManager.isFileDownloaded(activityStorage)) {
            fileManager.downloadFileFromiCloud(activityStorage);
        }

        localActivities = JSON.parse(fileManager.readString(activityStorage));
        
        for (let i = 0; i < localActivities.length; i++) {
            localActivityIDs.push(localActivities[i].id)
        }
        for (let i = 0; i < onlineActivities.length; i++) {
            if (localActivityIDs.includes(onlineActivities[i].id)) {
                break
            }
            localActivities.unshift(onlineActivities[i]);
        }
        activitiesToStore = localActivities;
    } else {
        for (let i = 0; i < onlineActivities.length; i++) {
            activitiesToStore.push(onlineActivities[i]);
        }
    }
    fileManager.writeString(activityStorage, JSON.stringify(activitiesToStore));
}

async function getRefreshToken(init_code) {
    const refreshToken_link = auth_link
    let req;
    req = new Request(refreshToken_link)
    req.method = "POST";
    req.headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }

    req.body = JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        code: init_code,
        grant_type: 'authorization_code'
    })
    try {
        let res = await req.loadJSON()
        return res.refresh_token;
    } catch (error) {
        console.log("Something went wrong")
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }
}

async function getAuthToken(ref_token) {
    let req;
    req = new Request(auth_link)
    req.method = "POST";
    req.headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }

    req.body = JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        refresh_token: ref_token,
        grant_type: 'refresh_token'
    })
    try {
        let res = await req.loadJSON()
        return res.access_token;
    } catch (error) {
        console.log("Something went wrong")
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }
}

async function setupAssistant() {
    const promptInformation = new Alert()
    promptInformation.title = 'Setup assistant'
    promptInformation.message = 'Using the Activity Widget for Strava requires the app to read activities from your strava account.'
    promptInformation.addAction('Confirm')
    promptInformation.addCancelAction('Decline')

    if (await promptInformation.presentAlert() === 0) {
        const promptAuthorization = new Alert()
        promptAuthorization.title = 'Setup assistant'
        promptAuthorization.message = 'To authorize the app, please click on "Authorization", log into your Strava Account and give read permissions to the App. \n You will be forwarded to a 404 page, which is intended.\n On that 404 page copy the whole link from your browsers address bar and return to the Scriptable App.'
        promptAuthorization.addAction('Authorize')

        await promptAuthorization.present()
        Safari.open(`https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=http://localhost&response_type=code&scope=read_all,activity:read_all`);
        const promptInputCode = new Alert()
        promptInputCode.title = 'Setup assistant'
        promptInputCode.message = 'Please paste the copied link into the text field and confirm with OK'
        promptInputCode.addTextField("Paste the link here...");
        promptInputCode.addAction('OK')

        await promptInputCode.present()
        let init_code = promptInputCode.textFieldValue(0)
        let linkValid = true;
        try {
            init_code = init_code.split("&code=")
            init_code = init_code[1].split("&scope")
            init_code = init_code[0]
        } catch (e) {
            linkValid = false
        }

        if (linkValid === false) {
            while (linkValid !== true) {
                let promptCodeError = new Alert()
                promptCodeError.title = 'Error'
                promptCodeError.message = `Something went wrong... Please paste the link into the field below again. \n(If this error message keeps coming up, please restart the setup process)`
                promptCodeError.addTextField("Paste the link here..")

                promptCodeError.addAction('OK')
                promptCodeError.addCancelAction('Cancel')
                if (await promptCodeError.presentAlert() === 0) {
                    try {
                        init_code = promptCodeError.textFieldValue(0)
                        init_code = init_code.split("&code=");
                        init_code = init_code[1].split("&scope");
                        init_code = init_code[0];
                        linkValid = true;
                    } catch (e) {
                        linkValid = false;
                    }
                } else {
                    Script.complete
                }
            }
        }

        let ref_token = await getRefreshToken(init_code)

        // Workout goals:
        let runGoalInput;
        let rideGoalInput;
        let swimGoalInput;
        const promptGoalSelection = new Alert()
        promptGoalSelection.title = 'Workout goals'
        promptGoalSelection.message = 'Please chose your monthly workout goals for the different workout types.\nIf you have no workout goal for a workout type, just insert a 0. \nNOTICE: Workout goals are only displayed in "medium" widget size.'
        promptGoalSelection.addTextField('Ride goal in km')
        promptGoalSelection.addTextField('Run goal in km')
        promptGoalSelection.addTextField('Swim goal in km')
        promptGoalSelection.addAction('Done')
        promptGoalSelection.addCancelAction('Cancel')
        await promptGoalSelection.presentAlert()

        rideGoalInput = promptGoalSelection.textFieldValue(0)
        runGoalInput = promptGoalSelection.textFieldValue(0)
        swimGoalInput = promptGoalSelection.textFieldValue(0)

        const widgetConfig = ref_token + ";" + runGoalInput + ";" + rideGoalInput + ";" + swimGoalInput
        Pasteboard.copy(widgetConfig)
        const promptCopyConfiguration = new Alert()
        promptCopyConfiguration.title = 'Setup complete'
        promptCopyConfiguration.message = 'The setup process was successful! A configuration string was copied into your clipboard. Paste this string into the widget parameter (long press on the widget -> edit widget -> "Parameter").'
        promptCopyConfiguration.addAction('Finish')
        await promptCopyConfiguration.present()
    }
}

/////////////////////////////////////////////////////////////
/////////////////////// Initial Config //////////////////////
/////////////////////////////////////////////////////////////

if (!config.runsInWidget && config.runsInApp && !debug) {
    const prompt = new Alert()
    prompt.message = 'Do you want to start the setup assistant?'
    prompt.addAction('Yes')
    prompt.addCancelAction('No')

    if (await prompt.presentAlert() === 0) {
        await setupAssistant()
    }
    if (debug === false) {
        Script.complete()
    }
}

if (widgetInput.length < 45 && !debug) {
    errorWidget.init("Please start the setup assistant by executing the script in the app.");
}

// Update activity database
try {
    const acc_token = await getAuthToken(ref_token);
    await updateActivityStorage(acc_token);
} catch {
    if (!fileManager.fileExists(activityStorage)) {
        throw new Error("Es existieren keine Aktivitäten! (file missing)")
    }
}

/////////////////////////////////////////////////////////////
///////////// Widget Layout - Newest Activity ///////////////
/////////////////////////////////////////////////////////////

activityCalenderWidget.init();