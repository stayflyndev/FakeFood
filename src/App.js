import React, { Component } from 'react';
import './App.css';
import HomePage from './pages/Hompage/Homepage';
import { Route, Redirect, Switch } from 'react-router-dom';
import MexicanPage from './pages/Categories/Mexican/Mexican.component'
import BBQPage from './pages/Categories/Bbq/Bbq.component'
import ChinesePage from './pages/Categories/Chinese/Chinese.component'
import JamaicanPage from './pages/Categories/Jamaican/Jamaican.component'
import Register from './pages/Login/Login'
import Shop from './pages/Shop/Shop.component'
import Header from './components/NavBar/NavBar.component'
import { auth, storeUserProfileDocument } from './firebase/firebase.utils'
import {connect} from 'react-redux'
import {setCurrentUser} from './redux/user/users.actions'
;

class App extends Component {

  // property
  unsubscribeFromAuth = null

  componentDidMount() {


    const {setCurrentUser} = this.props
    // whens someone signs in/out be aware without having to manually fetch
    // always aware when fb auth state has changed
    // subscriber --  // always open
    this.unsubscribeFromAuth = auth.onAuthStateChanged( async authUser => {
     if (authUser) {
       const userRef = await storeUserProfileDocument(authUser);

      //  get the snapshot details in order to set the state
       userRef.onSnapshot(snapShot => {
        setCurrentUser( {
           id: snapShot.id,
           ...snapShot.data()
         }) }, () => {
          console.log(this.state)        
       })
     }
     setCurrentUser( authUser)
    })

  }

  componentWillUnmount() {
    // will close the subsciption
    this.unsubscribeFromAuth();
  }


  render() {

    return (
      <div className="App">
        {/* start of the APP  *
     {/* nav bar and listing of categories */
        }
        <Header />
        <Switch>
        <Route path='/' component={HomePage} />
        <Route path='/mexican/' component={Shop} />
        <Route path='/jamaican/' component={Shop} />
        <Route path='/chinese/' component={Shop} />
        <Route path='/bbq/' component={Shop} />
        <Route path='/shop' component={Shop} />
      <Route exact path='/login' render={() => this.props.currentUser ?
       ( <Redirect to='/' /> )
      :(
        <Register />
      )
    }
    />
        </Switch>





      </div>
    )

  };
}

// access to currentUser

const mapStateToProps = ({ user }) => ({
  currentUser : user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch (setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
