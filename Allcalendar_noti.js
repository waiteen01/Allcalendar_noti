var CHANNEL_ACCESS_TOKEN = ''; //วาง chennel access token
var GROUP_ID = ''; // วาง group id

function sendCalendarEventsToLine() {
  var now = new Date();
  var tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  var tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 0, 0);

  var calendars = CalendarApp.getAllCalendars();
});


  var flexContents = {
    type: 'carousel',
    contents: []
  };

  calendars.forEach(function(calendar) {
    var events = calendar.getEvents(tomorrowStart, tomorrowEnd);
    if (events.length === 0) return; // ข้ามถ้าไม่มีภารกิจ

    var bubble = {
      type: "bubble",
      size: "giga",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "ภารกิจพรุ่งนี้ของ: " + calendar.getName(), ''),
            weight: "bold",
            size: "lg",
            color: "#00CC00",
            wrap: true
          },
          {
            type: "text",
            text: "วันที่ " + formatThaiDate(tomorrowStart) + " (" + events.length + " ภารกิจ)",
            size: "md",
            color: "#000000",
            wrap: true,
            margin: "sm"
          },
          {
            type: "separator",
            margin: "md"
          }
        ]
      }
    };

    events.forEach(function(event, index) {
      bubble.body.contents.push({
        type: "box",
        layout: "vertical",
        margin: "md",
        spacing: "sm",
        contents: [
          {
            type: "text",
            text: (index + 1) + ". " + event.getTitle(),
            size: "sm",
            weight: "bold",
            wrap: true
          },
          {
            type: "text",
            text: "เวลา: " + Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), "HH:mm") + " น.",
            size: "sm",
            color: "#555555"
          },
          {
            type: "text",
            text: "รายละเอียด: " + (event.getDescription() || "ไม่มี"),
            size: "sm",
            color: "#666666",
            wrap: true
          },
          {
            type: "separator",
            margin: "sm"
          }
        ]
      });
    });

    flexContents.contents.push(bubble);
  });

  if (flexContents.contents.length === 0) {
    Logger.log('ไม่มีภารกิจในวันพรุ่งนี้');
    return;
  }

  var payload = {
    to: GROUP_ID,
    messages: [
      {
        type: 'flex',
        altText: 'ภารกิจวันพรุ่งนี้',
        contents: flexContents
      }
    ]
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', options);
}


// ✅ ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
function formatThaiDate(date) {
  var thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  
  var day = date.getDate();
  var month = thaiMonths[date.getMonth()];
  var year = date.getFullYear() + 543;

  return day + " " + month + " " + year;
}
