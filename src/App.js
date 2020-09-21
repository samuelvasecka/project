import React, { Component } from 'react';
import './App.css';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";

var code = `
  class App extends React.Component {
    render () {
      return <div className="Table">
        <header className="Table-header">
          <table id='products'>
           <tbody>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
              {[
                {id: 1, name: "Product 1"},
                {id: 2, name: "Product 2"},
                {id: 3, name: "Product 3"},
              ].map(item => (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                </tr>
              ))}
           </tbody>
           </table>
           <br/>
           <label for="input">Label: </label>
           <input type="text" id="input" name="input"/>
        </header>
      </div>;
    }
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: code,
      colAdded: false,
      labEdited: false,
    }
    this.clickAddColumn = this.clickAddColumn.bind(this);
    this.clickEditLabel = this.clickEditLabel.bind(this);
  }

  findPlaces(code, input, index) {
    return code.slice(0, index) + input + code.slice(index);
  }

  clickAddColumn() {
    this.setState(state => {
      var codeTemp = this.state.code;
      if (this.state.colAdded) {
        codeTemp = code;
      } else {
        codeTemp = this.findPlaces(codeTemp, "\n                <th>Price</th>", codeTemp.indexOf("Name</th>") + 9);
        codeTemp = this.findPlaces(codeTemp, "\n                  <td>{item.price}</td>", codeTemp.indexOf("item.name") + 15);
        codeTemp = this.findPlaces(codeTemp, ", price: \"12,99€\"", codeTemp.indexOf("Product 1") + 10);
        codeTemp = this.findPlaces(codeTemp, ", price: \"7,00€\"", codeTemp.indexOf("Product 2") + 10);
        codeTemp = this.findPlaces(codeTemp, ", price: \"18,45€\"", codeTemp.indexOf("Product 3") + 10);
      }
      const colAdded = !this.state.colAdded;
      return {
        code: codeTemp,
        colAdded: colAdded,
      }
    })
  }

  clickEditLabel() {
    this.setState(state => {
      var codeTemp = this.state.code;
      if (this.state.labEdited) {
        codeTemp = code;
      } else {
        codeTemp = codeTemp.split("<label")[0] + "<label for=\"input\">Edited label: </label>" + codeTemp.split("</label>")[1];
      }
      const labEdited = !this.state.labEdited;
      return {
        code: codeTemp,
        labEdited: labEdited,
      }
    })
  }

  renderAddColButton() {
    if (this.state.colAdded) {
      return <button id="add-column" onClick={this.clickAddColumn}>
        Remove column
      </button>
    } else {
      return <button id="add-column" onClick={this.clickAddColumn}>
        Add column
      </button>
    }
  }

  renderEditLabButton() {
    if (this.state.labEdited) {
      return <button id="edit-label" onClick={this.clickEditLabel}>
        Get label back
      </button>
    } else {
      return <button id="edit-label" onClick={this.clickEditLabel}>
        Edit label
      </button>
    }
  }

  render() {
    return <div class="all">
      <div class="header" id="header">
        {this.renderAddColButton()}
        {this.renderEditLabButton()}
      </div>
      <LiveProvider code={this.state.code}>
        <div class="row">
          <div class="column" id="column1">
            <LiveEditor />
            <LiveError />
          </div>
          <div class="column" id="column2">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
    </div>
  }
}

export default App;
