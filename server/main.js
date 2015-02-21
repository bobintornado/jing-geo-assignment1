function load_data() {
  load_pop_data(Total, TOTAL);
  load_pop_data(Males, MALES);
  load_pop_data(Females, FEMALES);

  if (Centers.find().count() === 0) {
    Centers.insert(BREASTSCREEN);
  }
  if (Regions.find().count() === 0) {
    Regions.insert(MP14_REGION_WEB_PL);
  }
  if (Subzones.find().count() === 0) {
    Subzones.insert(MP14_SUBZONE_WEB_PL);
  }

}

function load_pop_data(db, data) {

  if (db.find().count() === 0) {
    for (var i = 0; i < data.length; i++) {
      db.insert(data[i])
    };
  }
};

if (Meteor.isServer) {
  Meteor.startup(function() {
    // modify the data

    // load the data
    // load_data();

  });
}