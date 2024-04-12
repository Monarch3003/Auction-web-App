// import express from 'express';

function renderDashboard(req, res) {
    // if(req.isAuthenticated()) {
    //     res.render('layout', {heading: 'Dashboard', route: 'dashboard', active: true});
    // }else {
    //     res.redirect('/api/user/login')
    // }
    res.render('layout', {heading: 'Dashboard', route: 'dashboard', active: true});
}

export {renderDashboard};