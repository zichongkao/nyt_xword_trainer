import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.scss";
import PinField from "react-pin-field";
import { ImCross, ImCheckmark, ImDrawer } from "react-icons/im"
import Slider from '@mui/material/Slider';

/* Utils */
const weekday_names = {
	0: 'Monday',
	1: 'Tuesday',
	2: 'Wednesday',
	3: 'Thursday',
	4: 'Friday',
	5: 'Saturday',
	6: 'Sunday',
};

const addOrdinalSuffix = (i) => {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
}

export const Home = () => {
	const { store, actions } = useContext(Context);
	return (
		<div className="text-center mt-2">
		  <div className="inline-block w-full max-w-xl">
			<div className="bg-white shadow overflow-hidden sm:rounded-lg m-10">
				{renderSettings()}
			</div>
			<div className="bg-white shadow overflow-hidden sm:rounded-lg m-10">
				{renderClueDetails(store.clue_list[store.current_clue_index])}
			</div>
		  </div>
		</div>
	);
};

const renderSettings = () => {
	const { store, actions } = useContext(Context);
	const resetRound = () => {
		actions.loadClueList();
	}
	function valuetext(value) {
		return `${10**value} most common answer`;
	}
	const marks = [
		{
			value: 0,
			label: '1',
		},
		{
			value: 1,
			label: '10',
		},
		{
			value: 2,
			label: '100',
		},
		{
			value: 3,
			label: '1,000',
		},
		{
			value: 4,
			label: '10,000',
		},
	]

	const handleChange2 = (event, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) {
		  return;
		}
	
		const minDistance = 1 // 1 order of magnitude
		if (newValue[1] - newValue[0] < minDistance) {
		  if (activeThumb === 0) {
			const clamped = Math.min(newValue[0], 4 - minDistance);
			actions.setMinAnswerRank(10**(clamped))
			actions.setMaxAnswerRank(10**(clamped+minDistance))
		  } else {
			const clamped = Math.max(newValue[1], minDistance);
			actions.setMinAnswerRank(10**(clamped-minDistance))
			actions.setMaxAnswerRank(10**(clamped))
		  }
		} else {
			actions.setMinAnswerRank(10**(newValue[0]))
			actions.setMaxAnswerRank(10**(newValue[1]))
		}
	  };

	return (
		<div>
  		<div className="font-semibold text-lg mt-3">Clue Selection</div>
		<div className="ml-6 mr-6 mb-6 mt-2">
		<form>
			<div className="mt-2">
            	<label htmlFor="answer_rank" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
  					<span className="font-light">
						{addOrdinalSuffix(store.min_answer_rank)} to {addOrdinalSuffix(store.max_answer_rank)} most common answers
					</span>
				</label>
				<Slider
        			getAriaLabel={() => 'Minimum distance'}
        			value={[Math.log10(store.min_answer_rank), Math.log10(store.max_answer_rank)]}
        			valueLabelDisplay="off"
        			getAriaValueText={valuetext}
					onChange={handleChange2}
				    min={0} // ie. 1
				    max={4} // ie. 10,000
					marks={marks}
        			disableSwap
      			/>
			</div>
		</form>
       	<button 
		  onClick={resetRound}
		  className="bg-blue-600 hover:bg-blue-700 hover:transition-colors py-1 px-3 rounded-lg mt-3 text-white"
		>	
			Draw new clues
		</button>
		</div>
		</div>
	)
}

const renderClueDetails = (clueDetails) => {
	const { store, actions } = useContext(Context);
	console.log('Rendering clueDetails', JSON.stringify(clueDetails));
	return clueDetails === undefined ? 
	    <div className="m-3">
        	<p className="font-semibold text-lg mt-3">{ store.is_loading ? "Loading... " : "No clues match the criteria"}</p>
		</div>
	    :
		<div className="m-3">
		  <div className="mt-2 flex justify-between">
			<div className="">
			  <span className="font-bold text-xl text-gray-400">Clue {store.current_clue_index+1}</span>
			  <span className="font-normal text-gray-400"> of 10</span>
			</div>
		    <div className="flex items-center">
			  <div>
			    <ImCheckmark className="fill-green-400 w-5 inline"/>
			    <span className="text-gray-400">{store.correct}</span>
			  </div>
			  <div className="ml-2">
			    <ImCross className="fill-red-400 w-5 inline"/>
			    <span className="text-gray-400">{store.wrong}</span>
			  </div>
		    </div>
		  </div>
          <p className="font-semibold text-xl">{clueDetails.clue}</p>
          <p className="font-thin">{weekday_names[clueDetails.weekday]}, {clueDetails.year}</p>
		  {renderInput(clueDetails.answer)}
		  {store.current_clue_status !== "unsubmitted" && 
		    <div className="mt-3 mb-3 mr-2 ml-2">
			  <span className="font-semibold">
			    {store.current_clue_status == "correct" && <ImCheckmark className="fill-green-400 w-5 inline"/>}
			    {store.current_clue_status == "wrong" && <ImCross className="fill-red-400 w-5 inline" />}
				{clueDetails.answer}
			  </span>	
			  <br />
		      <span className="font-thin ml-3">{clueDetails.year}-{String(clueDetails.month).padStart(2, '0')}-{String(clueDetails.day).padStart(2, '0')}, {clueDetails.index}</span>
			  <br />
			  <span className="font-thin ml-3">{addOrdinalSuffix(clueDetails.answer_rank)} most common answer</span>
			</div>}
		</div>
}

const renderInput = (answer) => {
	const { store, actions } = useContext(Context);
	const pinFieldRef = React.createRef();
	const isFinalClue = store.current_clue_index == store.clue_list.length -1
	console.log(store)

	const clearInput = () => {
		pinFieldRef.current.forEach(i => (i.value = ""));
	}

	const goNext = () => {
		clearInput();
		if (isFinalClue) {
			actions.loadClueList();
		} else {
			actions.incrementCurrentClueIndex();
			actions.setCurrentClueStatus("unsubmitted");
		}
	}

	const checkAnswer = () => {
		const proposed_answer = pinFieldRef.current.map(i => i.value).join("").toUpperCase();
		if (proposed_answer == answer.toUpperCase()) {
			console.log('correct!', proposed_answer, answer);
			actions.incrementCorrect();
			actions.setCurrentClueStatus("correct");
		} else {
			console.log('wrong!', proposed_answer, answer);
			actions.incrementWrong();
			actions.setCurrentClueStatus("wrong");
		}
	}

	const revealLetter = () => {
		const firstBlankIdx = pinFieldRef.current.findIndex(i => (i.value === ""))
		if (firstBlankIdx === -1) {return} else {
			pinFieldRef.current[firstBlankIdx].value = answer[firstBlankIdx].toUpperCase();
			const nextIdx = Math.min(answer.length-1, firstBlankIdx+1);
			pinFieldRef.current[nextIdx].focus();
		}
	}
	const renderRevealLetterButton = () => {
		return store.current_clue_status == "unsubmitted" && 
		    <button
			  onClick={revealLetter}
		  	  className="bg-gray-400 hover:bg-gray-500 hover:transition-colors py-1 px-3 rounded-lg mt-3 mr-3 text-white"
			>
				Reveal letter
			</button>
	}

	const renderActionButton = () => {
		return (store.current_clue_status == "unsubmitted" ?
        	<button 
		  	  onClick={checkAnswer}
		  	  className="bg-blue-600 hover:bg-blue-700 hover:transition-colors py-1 px-3 rounded-lg mt-3 text-white"
			>
				Submit
			</button>
		:
		    <button
		      onClick={goNext}
		      className="bg-gray-400 hover:bg-gray-500 hover:transition-colors py-1 px-3 rounded-lg mt-3 text-white"
			  autofocus
		    >
			    {isFinalClue ? "Next Round" : "Next"}
		    </button>
		)
	}
	return (
	  <div className="m-2">
		<PinField
		  ref={pinFieldRef}
		  className="pin-field"
		  validate="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
		  length={answer.length}
		  format={k => k.toUpperCase()}
		  key={answer}
		  onKeyPress={e => (e.key==="Enter") ? checkAnswer() : false}
		  autoFocus
		/>
		<br/>
		{renderRevealLetterButton()}
		{renderActionButton()}
	  </div>
	)
}