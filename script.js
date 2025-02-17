const APP_DOMAIN = window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://cricheroes.onrender.com";

async function fetchTournamentData() {

    /*const tournamentId = $("#tournamentId").val();
    if (!tournamentId) {
        alert("Please enter a Tournament ID");
        return;
    }*/

    let tournamentId = "1324577";

    $("#teams").html("<p>Loading...</p>");

    let API_URL = `${APP_DOMAIN}/api/tournament/${tournamentId}`;
    console.log(API_URL)

    $.ajax({
        url: API_URL, // Replace with your hosted API URL
        method: "GET",
        dataType: "json",
        success: function(result) {

            console.log(result);

            $("#teams").empty();

            result.data.forEach(team => {
                $("#teams").append(`<h3>${team.team_name}</h3>`);
                let membersHtml = "<ul>";
                team.members.forEach(member => {
                    membersHtml += `<li><strong>${member.name}</strong> (Player ID: ${member.player_id})<br>Stats: ${JSON.stringify(member.stats)}</li>`;
                });
                membersHtml += "</ul>";
                $("#teams").append(membersHtml);
            });
        },
        error: function() {
            alert("Error fetching tournament data");
        }
    });
}

$(document).ready(function() {
    $("#fetchDataBtn").click(fetchTournamentData);
});