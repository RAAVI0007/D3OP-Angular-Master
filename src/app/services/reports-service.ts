import domtoimage from 'dom-to-image';

export class ReportsService {
    expanded = ["subjectChecks", "domainChecks", "cmChecks", "tmChecks", "cmVsDmChecks", "poChecks", "prChecks", "vnChecks", "cnChecks", 'domainNameChecks', 'achievementChecks'];
  
    scatterMarkerColors = [
		['#f44842', '#f2af07', '#f2ee1f', '#b1e20d', '#7fef07', '#04f9d1'],
		['#0ee0f7', '#0798ed', '#ff6600', '#0418ef', '#02245b', '#660066'],
		['#cc00cc', '#00A591', '#ff80ff', '#990033', '#e20976', '#e21246'],
		['#003300', '#ddd444', '#009933', '#1c1a1b', '#ff9999', '#68db8b'],
		['#8e44ad', '#794747', '#728caf', '#7d6608', '#00695c', '#B8860B'],
		['#ff7043', '#afb42b', '#e57373', '#8d6e63', '#f9a825', '#809a45']
    ];

    getDropdownList(){ 
      return this.expanded;
    }
   
    public downloadCanvas(event:any, canvasId:string) {
        var anchor = event.target;
        let fileName = '';
        if(canvasId == 'cmVsTmGraph') {
          anchor.href = document.getElementsByTagName('canvas')[0].toDataURL();
          fileName = 'CurrentVsDesiredMaturity.png'
        }
        else if(canvasId == 'maturityPercentageGraph') { 
          anchor.href = document.getElementsByTagName('canvas')[1].toDataURL();
          fileName = 'CompetencyMaturityPercentage.png'
        }
        else if(canvasId == 'dmVsPmGraph'){
          anchor.href = document.getElementsByTagName('canvas')[2].toDataURL();
          fileName = 'CurrentVsPossibleMaturity.png';//
        }
        else if(canvasId == 'maturityPercentageDomainGraph') {
          anchor.href = document.getElementsByTagName('canvas')[3].toDataURL();
          fileName = 'DomainMaturityPercentage.png'
        } 

        //Plotly.downloadImage(graphDiv, {format: 'png', width: 800, height: 600, filename: 'newplot'});
        
        // set the anchors 'download' attibute (name of the file to be downloaded)
        anchor.download = fileName;
    }

    showFormattedValue(val) {
      return val == "0" ? '--' : val.toString();
    }

    

    pushDataToScatterPlot(competency) {
      let scatterplotXYAxis = 
        {	
          x : [ competency.complexityNext ],
          y : [ competency.valueNext ],
          mode : 'markers',
          type : 'scatter',
          textposition : 'top center',
          name : competency.subject+' (' +competency.complexityNext+', '+competency.valueNext+')',
          text : competency.subject,
          textfont : {
            family : 'Raleway, sans-serif'
          },
          marker : {
            size : 14,
            color : this.scatterMarkerColors[competency.complexityNext][competency.valueNext],
            width: 200
          },
          hoverinfo : 'none'
        }
        return scatterplotXYAxis;
      }

      getScatterplotLayout() {
        let layout = {
          autosize:false,
          width:900,
          height:700,
          xaxis : {
            title : 'Complexity (to next maturity)',
            gridcolor : "rgba(246, 17, 102, 0.4)",
            gridwidth : 0.5,
            side : 'right',
            linecolor : "transparent",
            linewidth : 2,
            range : [ 6, 0 ],
            automargin:true
          },
          yaxis : {
            title : 'Value (to next maturity)',
            gridcolor : "rgba(246, 17, 102, 0.4)",
            gridwidth : 0.5,
            linecolor : "transparent",
            linewidth : 2,
            side : 'right',
            range : [ 0, 6 ],
            automargin:true
          },
          showlegend : true,
          legend : {
            x : -100,
            y : 1,
          },
          paper_bgcolor : 'rgba(0,0,0,0)',
          plot_bgcolor : 'rgba(0,0,0,0)',
          margin : {
            l : 50,
            r : 50,
            b : 50,
            t : 50,
            pad : 4
          }
        };
        return layout;
      }

      public getScatterplotConf() {
        let config = {
          modeBarButtonsToRemove : [ 'toImage', 'sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian' ],
          displaylogo : false
        };
        return config;
      }

      public getPloylyLayout() {
        return {
          autosize:false,
          width:900,
          height:700,
          xaxis : {
            title : 'Complexity (to next maturity)',
            gridcolor : "rgba(246, 17, 102, 0.4)",
            gridwidth : 0.5,
            side : 'right',
            linecolor : "transparent",
            linewidth : 2,
            range : [ 6, 0 ],
            automargin:true
           
          },
          yaxis : {
            title : 'Value (to next maturity)',
            gridcolor : "rgba(246, 17, 102, 0.4)",
            gridwidth : 0.5,
            linecolor : "transparent",
            linewidth : 2,
            side : 'right',
            range : [ 0, 6 ],
            automargin:true
          },
          showlegend : true,
          legend : {
            x : -100,
            y : 1,
          },
          paper_bgcolor : 'rgba(0,0,0,0)',
          plot_bgcolor : 'rgba(0,0,0,0)',
          margin : {
            l : 50,
            r : 50,
            b : 50,
            t : 50,
            pad : 4
          }
        };
      }
      
    getPlotlyConfig() {
      return {
        modeBarButtonsToRemove : [ 'toImage', 'sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian' ],
        displaylogo : false
      };
    }

    getCMvsTMRadarOptions() {
      return {
        scale : {
          ticks : {
            max : 5,
            min : 0,
            beginAtZero : true,
            stepSize : 1
          },	
          pointLabels : {
            fontSize : 13
          }
        },
        elements : {
          line : {
            tension : 0,
            borderWidth : 3
          }
        }
      }
    }

    getCMVsTMRadarData() {
      return [
        {
          data: '', 
          label: 'Target Maturity',
          fill : true,
          backgroundColor : 'rgba(255, 99, 132, 0.2)',
          borderColor : 'rgb(255, 99, 132)',
          pointBackgroundColor : 'rgb(255, 99, 132)',
          pointBorderColor : '#fff',
          pointHoverBackgroundColor : '#fff',
          pointHoverBorderColor : 'rgb(255, 99, 132)'
        },
        {
          data: '', 
          label: 'Current Maturity',
          fill : true,
          backgroundColor : 'rgba(255, 99, 132, 0.2)',
          borderColor : 'rgb(255, 99, 132)',
          pointBackgroundColor : 'rgb(255, 99, 132)',
          pointBorderColor : '#fff',
          pointHoverBackgroundColor : '#fff',
          pointHoverBorderColor : 'rgb(255, 99, 132)'
        }
      ];
    }


    sortData(data:any) {
      data.sort(function(a, b){
        var nameA=a.itemName.trim().toLowerCase(), nameB=b.itemName.trim().toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return data;
    }

    sortById(data:any) {
      data.sort(function(a, b){
        var nameA=a.id, nameB=b.id
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return data;
    }

    exportToExcel(table) {
      var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
      , base64 = function(s) { return window.btoa(encodeURIComponent(s)) }
      , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        var blob = new Blob([format(template, ctx)]);
        var blobURL = window.URL.createObjectURL(blob);
        return blobURL;
    }

    getCompetencyFilterText() {
      return {
        "subject":[ 
        ],
        "domain":[ 
        ],
        "currentMaturity":[ 
        ],
        "desiredMaturity":[ 
        ],
        "cmVsDm":[ 
        ],
        "priorityOrder":[ 
        ],
        "priorityRationale":[ 
        ],
        "valueNext":[ 
        ],
        "complexityNext":[ 
        ]
      };

    }

    downloadPlotGraph(event) {
      event.preventDefault();
      domtoimage.toBlob(document.getElementById('scatterPlots'))
       .then(function(blob) {
           (<any>window).saveAs(blob, 'teamScatterChart.png');
         });
    }

    toggledropDownDisplay(dropdownType:string) {
      for(let displayIndex = 0 ; displayIndex < this.expanded.length; displayIndex++)  {
        let ele = document.getElementById(this.expanded[displayIndex]) as HTMLElement;
        if(dropdownType === this.expanded[displayIndex]) {
          if(ele.style.display === 'block') {
            ele.style.display = 'none';  
          } else {
            ele.style.display = 'block';
          }  
        } else {
          ele.style.display = 'none';
        }
      }

    }

    getMaturityPercentageChartData() {
      return [
        {
          data: '', 
          label: 'Maturity %',
          fill : true,
          backgroundColor : 'rgba(255, 99, 132, 0.2)',
          borderColor : 'rgb(255, 99, 132)',
          pointBackgroundColor : 'rgb(255, 99, 132)',
          pointBorderColor : '#fff',
          pointHoverBackgroundColor : '#fff',
          pointHoverBorderColor : 'rgb(255, 99, 132)'
        }
      ];
    }

    getMaturityPercentageOptions() {
      return {
        scale : {
          ticks : {
            max : 100,
            min : 0,
            beginAtZero : true,
            stepSize : 20
          },
          pointLabels : {
            fontSize : 13
          }
        },
        elements : {
          line : {
            tension : 0,
            borderWidth : 3
          }
        }
      };
    }

    getDmVsPmOptions() {
      return {
        scale : {
          pointLabels : {
            fontSize : 13
          }
        },
        elements : {
          line : {
            tension : 0,
            borderWidth : 3
          }
        }
      };
    }

    getMaturityPercentageDomainOptions() {
      return {
        scale : {
          ticks : {
            max : 100,
            min : 0,
            beginAtZero : true,
            stepSize : 20
          },
          pointLabels : {
            fontSize : 13
          }
        },
        elements : {
          line : {
            tension : 0,
            borderWidth : 3
          }
        }
      };
    }

    getDmVsPmData() {
      return [
        {
          label : 'Possible Maturity',
          data : '',
          fill : true,
          backgroundColor : 'rgba(255, 99, 132, 0.2)',
          borderColor : 'rgb(255, 99, 132)',
          pointBackgroundColor : 'rgb(255, 99, 132)',
          pointBorderColor : '#fff',
          pointHoverBackgroundColor : '#fff',
          pointHoverBorderColor : 'rgb(255, 99, 132)'
        }, {
          label : 'Current Maturity',
          data : '',
          fill : true,
          backgroundColor : 'rgba(54, 162, 235, 0.2)',
          borderColor : 'rgb(54, 162, 235)',
          pointRadius : '6',
          pointBackgroundColor : 'rgb(54, 162, 235)',
          pointBorderColor : '#fff',
          pointHoverBackgroundColor : '#fff',
          pointHoverBorderColor : 'rgb(54, 162, 235)'
        }
      ];
    }

    getMaturityValues() {
      return [
        { value: "0", text: " " },
        { value: "1", text: "Tin" },
        { value: "2", text: "Bronze" },
        { value: "3", text: "Silver" },
        { value: "4", text: "Gold" },
        { value: "5", text: "Platinum" },
      ];
    }

    getMaturityPercentageData() {
      return [
        {
          label : 'Maturity %',
          data : '',
          fill : true,
          backgroundColor : 'rgba(255, 99, 132, 0.2)',
          borderColor : 'rgb(255, 99, 132)',
          pointBackgroundColor : 'rgb(255, 99, 132)',
          pointBorderColor : '#fff',
          pointHoverBackgroundColor : '#fff',
          pointHoverBorderColor : 'rgb(255, 99, 132)'
        }
      ];
    }

    getDomainFilterText() {
      return {
        "domainNames":[ 
        ],
        "achievements":[ 
        ]
      };
    }

    getCompetencyHeaders() {
      return ["Competency", "Domain", "CM", "TM", "PO", "PR", "VN", "CN"];;
    }

    getPrItems(){
      return [
        {"id":"0","itemName":"--"},
        {"id":"1","itemName":"T"},
        {"id":"2","itemName":"II"},
        {"id":"3","itemName":"VC"},
        {"id":"4","itemName":"HV"},
        {"id":"5","itemName":"LC"},
        {"id":"6","itemName":"LT"},
        {"id":"7","itemName":"II"},
        {"id":"8","itemName":"DTM"},
        {"id":"9","itemName":"NAT"},
        {"id":"10","itemName":"NAO"}
      ];
    }
    sortFilterItems(sortFilterCompetencies:any, competencySortBy:string, competencyColumnSort:string) {
      if(competencyColumnSort === 'sorting_desc') {
        if(competencySortBy === 'domain') {
          return this.sortByDomainDesc(sortFilterCompetencies);
        } else if(competencySortBy === 'subject') {
          return this.sortBySubjectDesc(sortFilterCompetencies);
        } else if(competencySortBy === 'currentMaturity') {
          return this.sortByCMDesc(sortFilterCompetencies);
        } else if(competencySortBy === 'desiredMaturity') {
          return this.sortByDMDesc(sortFilterCompetencies);
        } else if(competencySortBy === 'cmVsDm') {
          return this.sortByCMVSDMDesc(sortFilterCompetencies);
        } else if(competencySortBy === 'priorityOrder') {
          return this.sortByPODesc(sortFilterCompetencies);
        } else if(competencySortBy === 'priorityRationale') {
          return this.sortByPRDesc(sortFilterCompetencies);
        } else if(competencySortBy === 'valueNext') {
          return this.sortByVNDesc(sortFilterCompetencies);
        }  else if(competencySortBy === 'complexityNext') {
          return this.sortByCNDesc(sortFilterCompetencies);
        }
      } else if(competencyColumnSort === 'sorting_asc') {
        if(competencySortBy === 'domain') {
          return this.sortByDomainAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'subject') {
          return this.sortBySubjectAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'currentMaturity') {
          return this.sortByCMAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'desiredMaturity') {
          return this.sortByDMAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'cmVsDm') {
          return this.sortByCMVSDMAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'priorityOrder') {
          return this.sortByPOAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'priorityRationale') {
          return this.sortByPRAsc(sortFilterCompetencies);
        } else if(competencySortBy === 'valueNext') {
          return this.sortByVNAsc(sortFilterCompetencies);
        }  else if(competencySortBy === 'complexityNext') {
          return this.sortByCNAsc(sortFilterCompetencies);
        }
        
      } 
    }

    sortByDomainAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.domain.trim().toLowerCase(), nameB=b.domain.trim().toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByDomainDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.domain.trim().toLowerCase(), nameB=b.domain.trim().toLowerCase()
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortBySubjectAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.subject.trim().toLowerCase(), nameB=b.subject.trim().toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortBySubjectDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.subject.trim().toLowerCase(), nameB=b.subject.trim().toLowerCase()
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByCMAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.currentMaturity.trim().toLowerCase(), nameB=b.currentMaturity.trim().toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByCMDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.currentMaturity.trim().toLowerCase(), nameB=b.currentMaturity.trim().toLowerCase()
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByDMAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.desiredMaturity.trim().toLowerCase(), nameB=b.desiredMaturity.trim().toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByDMDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.desiredMaturity.trim().toLowerCase(), nameB=b.desiredMaturity.trim().toLowerCase()
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByCMVSDMAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=parseInt(a.cmVsDm), nameB=parseInt(b.cmVsDm)
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByCMVSDMDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=parseInt(a.cmVsDm), nameB=parseInt(b.cmVsDm)
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByPOAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.priorityOrder, nameB=b.priorityOrder
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByPODesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.priorityOrder, nameB=b.priorityOrder
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByPRAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.priorityRationale, nameB=b.priorityRationale
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByPRDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.priorityRationale, nameB=b.priorityRationale
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByVNAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.valueNext, nameB=b.valueNext
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByVNDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.valueNext, nameB=b.valueNext
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByCNAsc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.complexityNext, nameB=b.complexityNext
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }

    sortByCNDesc(sortFilterCompetencies) {
      sortFilterCompetencies.sort(function(a, b){
        var nameA=a.complexityNext, nameB=b.complexityNext
        if (nameA > nameB) //sort string ascending
            return -1 
        if (nameA < nameB)
            return 1
        return 0 //default return value (no sorting)
      })
      return sortFilterCompetencies;      
    }
    
}
