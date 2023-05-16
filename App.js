import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,  Tooltip, Legend , Label} from 'recharts';
import './App.css'

const App = () => {
  const [histogramData, setHistogramData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const words = response.data.toLowerCase().match(/\b\w+\b/g);
      const wordCount = {};
      
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });

      const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
      const top20Words = sortedWords.slice(0, 20).map(([word, count]) => ({ word, count }));

      setHistogramData(top20Words);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + [
      ['Word', 'Count'],
      ...histogramData.map(({ word, count }) => [word, count])
    ].map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "histogram_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
  <div className="wrapp">
  <div className="container">
    <button className="button" onClick={fetchData}><div>Submit</div></button>

    {histogramData.length > 0 && (
      <div className="chart">
        
         <h1>Word Count Histogram</h1>
        <BarChart width={1500} height={530} data={histogramData} >
         
          <XAxis dataKey="word" >
          <Label
            value="Word"
            position="insideBottom"
            offset={-5}
            
          />
          </XAxis>
          <YAxis >
          <Label
            value="Frequency"
            position="insideLeft"
            angle={-90}
            offset={10}
            style={{ textAnchor: 'middle'}}
            
          />
          </YAxis>
          <Tooltip />
          <Legend align="right" verticalAlign="top" layout="vertical"  wrapperStyle={{ fontSize: '25px' }}  />
          <Bar dataKey="count" fill="rgba(192,193,246)" />
        </BarChart>
      </div>
    )}

    {histogramData.length > 0 && (
      <button className="export-button" onClick={exportCSV}><div>Export </div></button>
    )}
  </div>
  </div>
);
};

export default App;