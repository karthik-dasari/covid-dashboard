mapboxgl.accessToken = 'pk.eyJ1Ijoia2FydGhpay1kYXNhcmkiLCJhIjoiY2tvNXh4YzdhMHEyZTJ1bXlvbG9oaHo4ZiJ9.HAFC9NJ--Fl29Gs82CDDgQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 1,
    center: [0, 0]
});

map.scrollZoom.disable();

function getcolor(value) {
    if(value[2]>0 && value[2]<10000)
    return "#00d5ff";
    if(value[2]>10000 && value[2]<100000)
    return "#ffd900";
    if(value[2]>100000 && value[2]<1000000)
    return "#ffa600";
    if(value[2]>1000000)
    return "#ff0000";
}

fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
  
  .then(res => res.text())          
  .then(text => {
    var lines = text.split('\n');

            var result = [];
            for (var i = 1; i < lines.length; ++i) {
                if(i!=276)
                {
                    var rows = lines[i].split(',');
                    if(i==160 || i==194 || i==264)
                        var value = [
                            rows[4],
                            rows[3],
                            rows[rows.length-1]
                            ];
                    else
                        var value = [
                            rows[3],
                            rows[2],
                            rows[rows.length-1]
                            ];
                    if(rows[0]!="")
                    {
                        new mapboxgl.Marker({
                        color:getcolor(value),
                        })
                        .setLngLat(value)
                        .setPopup(new mapboxgl.Popup().setHTML("<h1>"+rows[0]+"</h1><h3>Number of cases:"+value[2]+"</h3>"))
                        .addTo(map);
                    }
                    else
                    {
                        new mapboxgl.Marker({
                            color:getcolor(value),
                        })
                        .setLngLat(value)
                        .setPopup(new mapboxgl.Popup().setHTML("<h1>"+rows[1]+"</h1><h3>Number of cases:"+value[2]+"</h3>"))
                        .addTo(map);}
                    }
                }
  })


  const xhr1 = new XMLHttpRequest();

  const url = `https://api.covid19india.org/data.json`;

  xhr1.open('GET', url, true);

  xhr1.onload = function() {

    const data = JSON.parse(this.response);
    var indiadata=data.statewise;
    var active =0;
    var confirmed=0;
    var deaths=0;
    var recovered=0;
    var temp='';

    for(var i in indiadata)
    {
        if (indiadata[i]["state"] === 'Total') {
            active = indiadata[i]["active"];
            confirmed = indiadata[i]["confirmed"];
            deaths = indiadata[i]["deaths"];
            recovered = indiadata[i]["recovered"];

            $('.stats').append(indiadata[i]["lastupdatedtime"]);
            $("#active").append(active);
            $("#confirmed").append(confirmed);
            $("#deaths").append(deaths);
            $("#recovered").append(recovered);
        }
        else
        {
            temp+= ' <tr >' +
            '<td><a data-toggle="modal" data-target="#' + indiadata[i]["state"].split(/\s/).join('') + '">' +
            indiadata[i]["state"] + '</a></td>' +
            '<td>' + indiadata[i]["confirmed"] + '</td>' +
            '<td>' + indiadata[i]["active"] + '</td>' +
            '<td>' + indiadata[i]["deaths"] + '</td>' +
            '<td>' + indiadata[i]["recovered"] + '</td>' +
            '</tr>';
        }
    }
    $("#data").append(temp);
    delete(temp);
}
xhr1.send();


const xhr2 = new XMLHttpRequest();

const url1 = `https://api.covid19india.org/state_district_wise.json`;

xhr2.open('GET', url1, true);

xhr2.onload = function(){
    const data = JSON.parse(this.response);
    var statedata=data;
    var temp='';
    for(var i in statedata)
    {
        temp += '<div id="' + i.split(/\s/).join('') +
                    '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"> <div class="modal-dialog" role="document"><div class="modal-content" style="text-justify: auto; text-align: center; align-items: center;align-self:center;"><div class="modal-header"> <h5 class="modal-title">' +
                    i + '</h5></div>';
                temp +=
                    '<div class="modal-body"><table class="table table-hover"><thead><tr><td>District</td><td>Confirmed</td></tr></thead><tbody>';
                for (var j in statedata[i].districtData) {
                    temp += '<tr ><td><strong style="color:#000000">' + j + '</strong>&nbsp;&nbsp;</td><td>' +
                        statedata[i].districtData[j]["confirmed"] + '</td></tr>';
                }
                temp +=
                    '</tbody></table></div><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div>';
    }
    $("#card-modal").append(temp);
    
}
xhr2.send();

var dailyconfirmed = [];
    var dailydeceased = [];
    var dailyrecovered = [];

    $.getJSON("https://api.covid19india.org/data.json", function (data) {
        _D = data.cases_time_series;
        var len = 1;
        for (var i in _D) {
            len++;
        }
        dailyconfirmed.push(_D[len-2]["dailyconfirmed"]);
        dailydeceased.push(_D[len-2]["dailydeceased"]);
        dailyrecovered.push(_D[len-2]["dailyrecovered"]);

        $(".dailyconfirmed").append(dailyconfirmed[0]);
        $(".dailyrecovered").append(dailyrecovered[0]);
        $(".dailydeceased").append(dailydeceased[0]);
    });