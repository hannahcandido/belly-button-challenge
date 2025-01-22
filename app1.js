
// Build the metadata panel
function initializeDashboard() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        let sampleIDs = data.names;

        for (let i = 0; i < sampleIDs.length; i++) {
          dropdownMenu
            .append("option")
            .text(sampleIDs[i])
            .property("value", sampleIDs[i]);
        }
    
        let initialSample = sampleIDs[0];
        createCharts(initialSample);
        populateMetadata(initialSample);
  });
}
  
  // Function to build both charts
  function createCharts(selectedSample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
      // Get the samples field
      let allSamples = data.samples;
  
      // Filter the samples for the object with the desired sample number
      let filteredSample = allSamples.filter(sampleObj => sampleObj.id == selectedSample);
      let sampleData = filteredSample[0];
    
      // Debugging: Log the filtered sample data to check if it’s loaded correctly
      console.log("Sample Data for " + selectedSample + ":", sampleData);
  
      // Get the otu_ids, otu_labels, and sample_values
      let otuIDs = sampleData.otu_ids;
      let otuLabels = sampleData.otu_labels;
      let sampleValues = sampleData.sample_values; 
  
      // Build a Bubble Chart
      let bubbleChartLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 50 },
        hovermode: "closest", 
        xaxis: { title: "OTU ID" },
      };
  
      // Render the Bubble Chart
      let bubbleChartData = [
        {
          x: otuIDs,
          y: sampleValues,
          text: otuLabels,
          mode: "markers",
          marker: {
            size: sampleValues,
            color: otuIDs,
            colorscale: "Earth"  
          }
        }
      ];
  
      // Debugging: Check if the bubble chart data is valid
      console.log("Bubble Chart Data:", bubbleChartData);
  
      Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
  
      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      let barYTicks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
  
      // Build a Bar Chart
      let barChartData = [
        {
          y: barYTicks,
          x: sampleValues.slice(0, 10).reverse(),
          text: otuLabels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      // Render the Bar Chart
      let barChartLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      // Debugging: Check if the bar chart data is valid
      console.log("Bar Chart Data:", barChartData);
  
      Plotly.newPlot("bar", barChartData, barChartLayout);
    });
  }
  
  // Function to populate metadata
  function populateMetadata(selectedSample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
      // Get the metadata field
      let metadataArray = data.metadata;
  
      // Filter the metadata for the object with the desired sample number
      let filteredMetadata = metadataArray.filter(sampleObj => sampleObj.id == selectedSample);
      let sampleMetadata = filteredMetadata[0];
  
      // Use d3 to select the panel with id of `#sample-metadata`
      let metadataPanel = d3.select("#sample-metadata");
      metadataPanel.html(""); // Clear existing metadata
  
      // Append each key-value pair from metadata
      for (let key in sampleMetadata) {
        metadataPanel.append("h6").text(`${key.toUpperCase()}: ${sampleMetadata[key]}`);
      }
    });
  }
  
  // Function for event listener
  function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
    createCharts(newSample);
    populateMetadata(newSample);
  }
  
  // Initialize the dashboard
  initializeDashboard();
