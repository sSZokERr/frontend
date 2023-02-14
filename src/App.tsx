import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

interface State{
  csokik: Csoki[] 
  nevInput: string;
  tipusInput: string;
  sulyInput: number;
}

interface Csoki{
  id: number;
  name: string;
  type: number;
  weight: number;
}

class App extends Component<{}, State>{

  constructor(props: {}){
    super(props);

    this.state = {
      nevInput: '',
      tipusInput: '',
      sulyInput: 0,
      csokik: [],
    }
  }

  async loadCsokik() {
    let respone = await fetch('http://localhost:3000/csoki');
    let data = await respone.json() as Csoki[];
    this.setState({
      csokik: data
    })
  }

  componentDidMount() {
    this.loadCsokik();
  }

  handleUpload = async () => {
    const { nevInput, tipusInput, sulyInput } = this.state;
    if(nevInput.trim() === '' || tipusInput.trim() === '' || sulyInput <1){
      // this.setState()- tel hibaüzenet megjelenítése
      return;
    }

    const adat = {
      name: nevInput,
      type: tipusInput,
      weight: sulyInput,
    }

    let response = await fetch('http://localhost:3000/csoki', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adat),
    });

    this.setState({ 
      nevInput: '',
      tipusInput: '',
      sulyInput: 0,
    })

    await this.loadCsokik();
  };

  async handleDelete(id: number) {
    let respone = await fetch('http://localhost:3000/csoki/ '+ id,{
      method: 'DELETE',
    }
    )
    await this.loadCsokik();
  }

  render() {
    return <div className='container-fluid body '>
    <h2>Csokik</h2>
    <div className="form grid">
    Nev: <input type="text" className='form-control' value={this.state.nevInput} onChange={e => this.setState({ nevInput: e.currentTarget.value})}/><br />
    Tipus: <input type="text" className='form-control' value={this.state.tipusInput} onChange={e => this.setState({ tipusInput: e.currentTarget.value})} /><br />
    Suly: <input type="number" className='form-control' value={this.state.sulyInput} onChange={e => this.setState({ sulyInput: parseInt(e.currentTarget.value)})}/><br />
    <button className='btn btn-secondary' onClick={this.handleUpload}>Hozzáad</button> <br />
    </div>
   
    <table>
    <tr>
            <th className='thead'>Nev </th>
            <th>Tipus </th>
            <th>Suly </th>
          </tr>
    </table>
    {
      this.state.csokik.map(csokik =>
        <table> 
          <tr>
            <td>{csokik.name}</td>
            <td>{csokik.type}</td>
            <td>{csokik.weight}</td>
            <td><button onClick={() => this.handleDelete(csokik.id)}>Törlés</button></td>
          </tr>
        </table>
        )
      }
      </div>

  }
}

export default App;