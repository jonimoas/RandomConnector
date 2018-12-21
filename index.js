var r;
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
        "background-color": "#666",
        label: "data(id)"
      }
    },

    {
      selector: "edge",
      style: {
        width: 3,
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
var values = [];
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
    console.log(
      parseInt(
        parseInt(
          cy
            .elements("edge")
            [cy.elements("edge").length - 1].data()
            .id.replace("e", "")
        ) + 1
      )
    );
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
  cy.center();
  values.push({
    a: cy
      .elements("edge")
      [values.length].target()
      .id(),
    b: 1
  });
  vegaEmbed("#vis", vlSpec).then(res =>
    res.view.insert("myData", values).run()
  );
}

function getRandomInt(max) {
  return Math.ceil(Math.random() * Math.floor(max));
}

var vlSpec = {
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

// Embed the visualization in the container with id `vis`
