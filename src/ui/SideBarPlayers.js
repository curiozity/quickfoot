
import { useDispatch } from 'react-redux';
import { startListPlayers, startNewPlayer } from '../actions/players';

function SideBarPlayers() {

    const dispatch = useDispatch();
    
    const handleAddPlayer = () => {
        dispatch( startNewPlayer() );
    }

    const handleListPlayers = () => {
        dispatch ( startListPlayers() );
    }

    return (
        <>
            <div className="row">
                <div className="col-2 bg-secondary">
                    <button onClick={ handleListPlayers } className="btn btn-secondary">Listado</button>
                </div>
            </div>
            <div className="row">
                <div className="col-2 bg-secondary">
                    <button onClick={ handleAddPlayer } className="btn btn-secondary">Añadir jugador</button>
                </div>
            </div>
        </>
    )

}

export default SideBarPlayers;

