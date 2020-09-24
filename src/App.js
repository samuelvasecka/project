import React, { Component } from 'react';
import './App.css';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";

var products = `
                {id: 1, name: "Product 1"},
                {id: 2, name: "Product 2"},
                {id: 3, name: "Product 3"},`;

var header = `
                <th>ID</th>
                <th>Name</th>`;

var components = `
                  <td>{item.id}</td>
                  <td>{item.name}</td>`;

const space1 = "                ";
const space2 = "                  ";

var code = `
  class App extends React.Component {
    render () {
      return <div className="Table">
        <header className="Table-header">
          <table id='products'>
           <tbody>
              <tr>
              </tr>
              {[
              ].map(item => (
                <tr>
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
      products: products,
      header: header,
      components: components,
      column: 0,
    }
    this.clickAddColumn = this.clickAddColumn.bind(this);
    this.clickEditLabel = this.clickEditLabel.bind(this);
  }

  createCode(code, products, header, components) {
    return code.slice(0, 203) + header + code.slice(203, 240) + products + code.slice(240, 291) + components + code.slice(291);
  }

  clickAddColumn() {
    var name = document.getElementById('input').value;
    this.setState(state => {
      var headerTemp = this.state.header + "\n" + space1 + "<th>" + name + "</th>";
      var componentsTemp = this.state.components + "\n" + space2 + "<td>{item.added" + this.state.column + "}</td>";
      var array = this.state.products.split("\"},", 3);
      var productsTemp = "";
      array.forEach((item, i) => {
        productsTemp += item + "\", added" + this.state.column + ": \"" + this.state.column + "\"},";
      });
      var column = this.state.column + 1;
      return {
        header: headerTemp,
        components: componentsTemp,
        products: productsTemp,
        column: column,
      }
    })
  }

  clickEditLabel(e) {
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
      return <button id="add-column" onClick={this.clickAddColumn}>
        Add column
      </button>
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
        <input type="text" id="input" placeholder="column name" name="input"/>
        {this.renderAddColButton()}
        {this.renderEditLabButton()}
      </div>
      <LiveProvider code={this.createCode(this.state.code, this.state.products, this.state.header, this.state.components)}>
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
