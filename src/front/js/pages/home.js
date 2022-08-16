import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.scss";
import PinField from "react-pin-field";
import { ImCross, ImCheckmark } from "react-icons/im"


export const Home = () => {
	const { store, actions } = useContext(Context);
	console.log(store.clue_list);
	return (
		<div className="text-center mt-5">
			<p className="font-bold text-lg">Score: {store.round_score} out of {store.clue_list.length}</p>
			<div className="bg-white shadow overflow-hidden sm:rounded-lg m-10">
				{renderClueDetails(store.clue_list[store.current_clue_index])}
			</div>
		</div>
	);
};

const renderClueDetails = (clueDetails) => {
	const { store, actions } = useContext(Context);
	console.log(JSON.stringify(clueDetails))
	return clueDetails !== undefined && (
		<div className="border-t border-gray-200">
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
	)
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