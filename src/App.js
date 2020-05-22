import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const app = new Clarifai.App({
 apiKey: 'cf1286192f4e446c91ed6cd480cbc29a'
});


const particlesOptions = {
                particles: {
                  number: {
                    value: 30,
                    density: {
                      enable: true,
                      value_area: 800
                    }
                  }
                }
              }

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:'',
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarafiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarafiFace.left_col * width,
      topRow: clarafiFace.top_row * height,
      rightCol: width - (clarafiFace.right_col * width),
      bottomRow: height - (clarafiFace.bottom_row*width)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }


  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    }
    else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
    <div className="App">
    <Particles className='particles'
      params={particlesOptions} 
    />
    <Navigation isSignIn={this.state.isSignIn} onRouteChange = {this.onRouteChange}/>
    { this.state.route === 'home'
      ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}
          />       
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> 
        </div>
      :(
        this.state.route === 'signin'
        ? <SignIn onRouteChange = {this.onRouteChange}/>
        : <Register onRouteChange = {this.onRouteChange}/>
        )
    }  
    </div>
  );
  }
}

export default App;