import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.scss";
import PinField from "react-pin-field";
import { ImCross, ImCheckmark, ImCircleUp, ImCircleDown } from "react-icons/im"


export const Home = () => {
	const { store, actions } = useContext(Context);
	console.log(store.clue_list);
	return (
		<div className="text-center mt-2 max-w-xl">
			<p className="font-bold text-lg">Score: {store.round_score} / {store.clue_list.length}</p>
			<div className="bg-white shadow overflow-hidden sm:rounded-lg m-10">
				{renderClueDetails(store.clue_list[store.current_clue_index])}
			</div>
			<div className="bg-white shadow overflow-hidden sm:rounded-lg m-10">
				{renderSettings()}
			</div>
		</div>
	);
};

const renderSettings = () => {
	const { store, actions } = useContext(Context);
	const resetRound = () => {
		actions.loadClueList();
	}
	return (
		<div>
  		<div className="font-semibold text-lg mt-3">Settings</div>
		<div class="ml-6 mr-6 mb-6 mt-2">
		<form>
			<div className="mt-2">
				<div className="relative">
				  <span className="absolute -bottom-4 left-0 font-light text-sm">10</span>
            	  <label for="top_x_answers" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
					Selection: <span className="font-light">{store.top_x_answers} most common answers</span>
				  </label>
				  <span className="absolute -bottom-4 right-0 font-light text-sm">1000</span>
				</div>
				<input
				  id="top_x_answers"
				  type="range"
				  min="10"
				  max="1000"
				  step="10"
				  value={store.top_x_answers}
				  onInput={e => actions.setTopXAnswers(e.target.value)}
				  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        	</div>
			<div className="mt-2">
				<div className="relative">
				  <span className="absolute -bottom-4 left-0 font-light text-sm">10</span>
            	  <label for="round_size" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
					Round size: <span className="font-light">{store.round_size} clues</span>
				  </label>
				  <span className="absolute -bottom-4 right-0 font-light text-sm">100</span>
				</div>
				<input
				  id="round_size"
				  type="range"
				  min="10"
				  max="100"
				  step="10"
				  onInput={e => actions.setRoundSize(e.target.value)}
				  value={store.round_size}
				  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        	</div>
			<div className="mt-2">
				<div className="relative">
				  <span className="absolute -bottom-4 left-0 font-light text-sm">2010</span>
				  <label for="start_year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
					Start year: <span className="font-light">{store.start_year}</span>
				  </label>
				  <span className="absolute -bottom-4 right-0 font-light text-sm">2022</span>
				</div>
				<input
				  id="start_year"
				  type="range"
				  min="2010"
				  max="2022"
				  onInput={e => actions.setStartYear(e.target.value)}
				  value={store.start_year}
				  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
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
		<div>
          <p className="font-semibold text-lg mt-3">{clueDetails.clue}</p>
          <p className="font-thin">{clueDetails.weekday}, {clueDetails.year}</p>
		  {renderInput(clueDetails.answer)}
		  {store.current_clue_status !== "unsubmitted" && 
		    <div className="m-3">
			  <span className="font-semibold">
			    {store.current_clue_status == "correct" && <ImCheckmark className="fill-green-400 w-10 inline"/>}
			    {store.current_clue_status == "wrong" && <ImCross className="fill-red-400 w-10 inline" />}
				{clueDetails.answer}
			  </span>	
		      <span className="font-thin ml-3">{clueDetails.explanation}</span>
			</div>}
		</div>
}

const renderInput = (answer) => {
	const { store, actions } = useContext(Context);
	const pinFieldRef = React.createRef();
	console.log(store)

	const clearInput = () => {
		pinFieldRef.current.forEach(i => (i.value = ""));
	}

	const goNext = () => {
		clearInput();
		actions.incrementCurrentClueIndex();
		actions.setCurrentClueStatus("unsubmitted");
	}

	const checkAnswer = () => {
		const proposed_answer = pinFieldRef.current.map(i => i.value).join("").toUpperCase();
		if (proposed_answer == answer.toUpperCase()) {
			console.log('correct!', proposed_answer, answer);
			actions.incrementScore();
			actions.setCurrentClueStatus("correct");
		} else {
			console.log('wrong!', proposed_answer, answer);
			actions.setCurrentClueStatus("wrong");
		}
	}

	const isFinalClue = store.current_clue_index == store.clue_list.length -1

	const renderButton = () => {
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
		      className="bg-gray-600 hover:bg-gray-700 hover:transition-colors py-1 px-3 rounded-lg mt-3 text-white"
		    >
			    {isFinalClue ? "Next Round" : "Next"}
		    </button>
		)
	}
	console.log('length', answer.length)
	return (
	  <div className="m-2">
		<PinField
		  ref={pinFieldRef}
		  className="pin-field"
		  validate="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
		  length={answer.length}
		  format={k => k.toUpperCase()}
		  key={answer}
		  autoFocus
		/>
		<br/>
		{renderButton()}
	  </div>
	)
}