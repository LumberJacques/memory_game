( function() {

    let domContainer = document.querySelector( '#gameBoard' );
    if ( !domContainer ) return alert( 'Unable to initialize.' );

    let selectRand = max => Math.floor( Math.random() * ( max || 1 ) ) + 1;

    let master = {};
    for ( var i = 1; i < 9; i++ ) master[i] = 0;

    let gameboard = initBoard();
    initDisplay( gameboard );

    let match = false;
    let active = [];
    let matchCnt = 0;
    let timerID;
    let timeCounter = 0;

    function initBoard() {

        let board = {};

        for ( var i = 1; i <= 16; i++ ) {

            let rand = selectRand( 8 );
            while ( master[rand] >= 2 ) rand = selectRand( 8 );

            let pseudo = Math.random().toString( 36 ).replace( /^0\./, '' );
            while ( board.hasOwnProperty( pseudo ) ) pseudo = Math.random().toString( 36 ).replace( /^0\./, '' );

            master[rand]++;
            board[pseudo] = rand;
        }

        return board;

    }

    function initDisplay( selectionArr ) {

        for ( var prop in selectionArr ) {

            let node = document.createElement( 'li' );
            node.setAttribute( 'data-match', prop );

            let img = document.createElement( 'img' );
            img.setAttribute( 'src', 'assets/' + selectionArr[prop] + '.jpg' );
            node.appendChild( img );

            domContainer.appendChild( node );
        }

    }

    function handleClick( e ) {

        let target = e.target.closest( 'li' );
        if ( target.classList.contains( 'flipped' ) || target.classList.contains( 'matched' ) ) return;

        if ( !timerID ) startTimer();
        target.classList.add( 'flipped' );
        active.push( target );

        let activeID = gameboard[target.getAttribute( 'data-match' )];

        if ( active.length > 1 ) {

            if ( activeID == match ) {

                matchCnt++;

                ( function( arr ) {
                    setTimeout( function() {
                        arr.map( item => {
                            item.classList.add( 'matched' );
                        } );
                    }, 500 );
                } )( active );

                if ( matchCnt >= 8 ) triggerGameEnd();

            } else {

                ( function( arr ) {
                    setTimeout( function() {
                        arr.map( item => {
                            item.classList.remove( 'flipped' );
                        } );
                    }, 500 );
                } )( active );

            }

            active = [];
            match = false;

        } else {
            match = activeID;
        }

    }

    function triggerGameEnd() {

        let time = stopTimer();

        document.querySelector( '#notificationBar' ).innerHTML = 'You Won!<br /><div>' + time + '</div>';

        setTimeout( function() {
            document.querySelector( '#notificationBar' ).classList.add( 'active' );
        }, 400 );

    }

    function startTimer() {
        timerID = setInterval( function() {
            timeCounter++;
        }, 100 );
    }

    function stopTimer() {

        clearInterval( timerID );

        let mins = Math.floor( timeCounter / 600 );
        let secs = Math.floor( ( timeCounter % 600 ) / 10 );
        let mils = timeCounter % 10;

        return `${mins.toString().padStart( 2, '0' )}:${secs.toString().padStart( 2, '0' )}.${mils.toString().padEnd( 2, '0' )}`


    }

    document.querySelectorAll( '#gameBoard li' ).forEach( item => {
        item.addEventListener( 'click', handleClick );
    } );

} )();
