var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  elements: [
    // list of graph elements to start with
  ],

  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        label: "data(id)"
      }
    },

    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle"
      }
    }
  ],

  layout: {
    name: "grid",
    rows: 1
  }
});
var targetValues = [];
var sourceValues = [];
function addNode() {
  if (cy.elements("node").length == 0) {
    cy.add({
      group: "nodes",
      data: {
        id: 1
      },
      position: {
        x: getRandomInt(201),
        y: getRandomInt(201)
      }
    });
    cy.center();
  } else {
    cy.add({
      group: "nodes",
      data: {
        id:
          parseInt(
            cy.elements("node")[cy.elements("node").length - 1].data().id
          ) + 1
      },
      position: {
        x: getRandomInt(201),
        y: getRandomInt(201)
      }
    });
  }
  cy.center();
}
function addMany() {
  var i = 0;
  while (i <= 1000) {
    addConnection();
    i++;
  }
  draw();
}
function addOne(){
  addConnection();
  draw();
}
function addConnection() {
  var s = getRandomInt(
    cy.elements("node")[cy.elements("node").length - 1].data().id
  );
  var t = getRandomInt(
    cy.elements("node")[cy.elements("node").length - 1].data().id
  );
  while (s == 0) {
    s = getRandomInt(
      cy.elements("node")[cy.elements("node").length - 1].data().id
    );
  }
  while (t == 0 || s == t) {
    t = getRandomInt(
      cy.elements("node")[cy.elements("node").length - 1].data().id
    );
  }
  if (cy.elements("edge").length == 0) {
    cy.add({
      group: "edges",
      data: {
        id: "1e",
        source: s,
        target: t
      }
    });
    cy.center();
  } else {
    cy.add({
      group: "edges",
      data: {
        id:
          parseInt(
            parseInt(
              cy
                .elements("edge")
                [cy.elements("edge").length - 1].data()
                .id.replace("e", "")
            ) + 1
          ) + "e",
        source: s,
        target: t
      }
    });
  }
  targetValues.push({
    a: cy
      .elements("edge")
      [targetValues.length].target()
      .id(),
    b: 1
  });
  sourceValues.push({
    a: cy
      .elements("edge")
      [sourceValues.length].source()
      .id(),
    b: 1
  });
  cy.center();
}
function draw() {

  vegaEmbed("#sentChart", sentSpec).then(res =>
    res.view.insert("myData", targetValues).run()
  );
  vegaEmbed("#receiveChart", sourceSpec).then(res =>
    res.view.insert("myData", sourceValues).run()
  );
  var i = 1;

  while (i <= cy.elements("node").length) {
    var sourceCount = 0;
    for (const s of sourceValues) {
      if (s.a == i) {
        sourceCount++;
      }
    }
    var destinationsCount = 0;
    for (const s of targetValues) {
      if (s.a == i) {
        destinationsCount++;
      }
    }

    var size = 1;
    if (sourceCount != 0) {
      if (destinationsCount != 0) {
        size = destinationsCount / sourceCount;
        size = size * 10;
      } else {
        size = 1;
      }
    } else {
      size = 30;
    }
    var color;
    if (size <= 10) {
      color = "#A44";
    } else {
      color = "#4A4";
    }
    cy.style()
      .selector("#" + i)
      .style({
        width: size,
        height: size,
        "background-color": color
      })

      .update(); // indicate the end of your new stylesheet so that it can be updated on elements
    i++;
  }
}
function getRandomInt(max) {
  return Math.ceil(Math.random() * Math.floor(max));
}

var sentSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v3.json",
  data: {
    name: "myData"
  },
  mark: "bar",
  encoding: {
    y: {
      field: "a",
      type: "ordinal",
      axis: {
        title: "Node ID"
      },
      sort: { op: "sum", field: "b", order: "descending" }
    },
    x: {
      aggregate: "sum",
      field: "b",
      type: "quantitative",
      axis: {
        title: "Times targeted"
      }
    }
  }
};
var sourceSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v3.json",
  data: {
    name: "myData"
  },
  mark: "bar",
  encoding: {
    y: {
      field: "a",
      type: "ordinal",
      axis: {
        title: "Node ID"
      },
      sort: { op: "sum", field: "b", order: "descending" }
    },
    x: {
      aggregate: "sum",
      field: "b",
      type: "quantitative",
      axis: {
        title: "Times sent"
      }
    }
  }
};

// Embed the visualization in the container with id `vis`
