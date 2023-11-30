import { useState } from 'react';
import s from './Picker.module.scss'
import Scene from '../../webgl/Scene'

const Picker = () => {
    const [activeIndex, setActiveIndex] = useState(null); 

    const pickVisualizer = (index) => {
        Scene.changeVisualizer(index);

        setActiveIndex(index);
    }

    return (
		<div className={s.picker}>
			<div onClick={() => pickVisualizer(0)} className={`${s.item} ${activeIndex === 0 ? s.item__active : ''}`}>Cube</div>
			<div onClick={() => pickVisualizer(1)} className={`${s.item} ${activeIndex === 1 ? s.item__active : ''}`}>Signal</div>
			<div onClick={() => pickVisualizer(2)} className={`${s.item} ${activeIndex === 2 ? s.item__active : ''}`}>Waves</div>
			{/* <div onClick={() => pickVisualizer(1)} className={`${s.item} ${activeIndex === 3 ? s.item__active : ''}`}>Particles</div> */}
		</div>
	);
}

export default Picker;