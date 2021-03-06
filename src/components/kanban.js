import React, { useState, useReducer } from "react";
import styled from "styled-components";

const Holder = styled.div`
  position: relative;
  width: 20rem;
  min-height: 10rem;
  background-color: #f4faf4;
  border: none;
  border-radius: 5px;
  margin: 2rem;
  display: inline-flex;
  flex-flow: column nowrap;
  align-items: center;
  overflow: hidden;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
  > .holder-title {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background-color: #40434a;
    color: white;
    font-size: 1.5rem;
    user-select: none;
  }
  > .holder-add {
    position: absolute;
    top: 0;
    right: 3%;
    height: 3rem;
    line-height: 3rem;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    user-select: none;
  }
`;

const AddCard = styled.form`
  display: none;
  width: 100%;
  height: 15rem;
  background-color: #40434a;
  border-radius: 0 0 5px 5px;
  > .add-card-title {
    width: 85%;
    height: 10%;
    margin: 0 5%;
    padding: 1% 2.5%;
    border: none;
    border-radius: 5px;
    outline: none;
    background-color: white;
    font-size: 1rem;
  }
  > .add-card-title:focus {
    outline: 2px solid #7f12ff;
  }
  > .add-card-text {
    width: 85%;
    height: 55%;
    margin: 5%;
    padding: 1% 2.5%;
    border: none;
    border-radius: 5px;
    outline: none;
    background-color: white;
    font-size: 1rem;
    resize: none;
  }
  > .add-card-text:focus {
    outline: 2px solid #7f12ff;
  }
  > .add-card-confirm {
    width: 100%;
    background-color: #40434a;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
  > .add-card-confirm .add-card-btn {
    background-color: transparent;
    outline: none;
    border: none;
    color: white;
    margin: 0 5%;
    padding: 0;
    font-size: 1rem;
    height: 1rem;
    line-height: 1rem;
    user-select: none;
    cursor: pointer;
  }
`;

const Card = styled.div`
  position: relative;
  width: 19rem;
  height: 10rem;
  margin: 0.5rem 0;
  background-color: #ffffff;
  border: none;
  border-radius: 5px;
  overflow: hidden;
  &.focused {
    background-color: #f0f0f0;
    outline: 1px dashed #d5d5d5;
  }
  &.invaild {
    opacity: 0.5;
  }
  &.vaild {
    box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
  }
  > .delete-btn {
    position: absolute;
    top: 0%;
    right: 2.5%;
    font-size: 1.5rem;
    font-weight: 500;
    cursor: pointer;
  }
  > .card-title {
    padding: 0 1.5rem 0 0.5rem;
    height: 2rem;
    font-size: 1rem;
    line-height: 2rem;
    background-color: #dedede;
    color: #000000;
  }
  > .card-text {
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

const uid = (len) => {
  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (el) => el.toString(36)).join("");
};

const BoardOne = {
  title: "REQUESTED",
  cards: [
    {
      id: uid(16),
      tag: "vaild",
      title: "????????? ?????? 1 (?????? 1)",
      text: "????????? ????????? 1"
    }
  ]
};

const BoardTwo = {
  title: "IN PROGRESS",
  cards: [
    {
      id: uid(16),
      tag: "vaild",
      title: "????????? ?????? 1 (?????? 2)",
      text: "????????? ????????? 1"
    },
    {
      id: uid(16),
      tag: "vaild",
      title: "????????? ?????? 2 (?????? 2)",
      text: "????????? ????????? 2"
    }
  ]
};

const BoardThree = {
  title: "DONE",
  cards: [
    {
      id: uid(16),
      tag: "vaild",
      title: "????????? ?????? 1 (?????? 3)",
      text: "????????? ????????? 1"
    },
    {
      id: uid(16),
      tag: "vaild",
      title: "????????? ?????? 2 (?????? 3)",
      text: "????????? ????????? 2"
    },
    {
      id: uid(16),
      tag: "vaild",
      title: "????????? ?????? 3 (?????? 3)",
      text: "????????? ????????? 3"
    }
  ]
};

const itemReducer = (state, action) => {
  let stringified = JSON.stringify(state);
  let copied = JSON.parse(stringified);
  switch (action.type) {
    case "DELETE":
      // type, holder, index
      copied[action.holder].cards.splice(action.index, 1);
      return [...copied];
    case "DELETE_BY_ID":
      // type, id
      copied = copied.map((el) => {
        return {
          ...el,
          cards: el.cards.filter((item) => item.id !== action.id)
        };
      });
      return [...copied];
    case "ADD_NEW":
      // type, holder, title, text
      const newItem = {
        id: uid(16),
        tag: "vaild",
        title: action.title,
        text: action.text
      };
      copied[action.holder].cards.push(newItem);
      return [...copied];
    case "INSERT":
      // type, thisItem, toThisHolder, atThisIndex
      const thisItem = action.thisItem;
      copied[action.toThisHolder].cards.splice(action.atThisIndex, 0, thisItem);
      return [...copied];
    default:
      return state;
  }
};

const isTopOrBottom = (height, current) => {
  if (Math.floor(height / 2) > current) return "TOP";
  else return "BOTTOM";
};

const isBoardEmpty = (board, index) => {
  if (board[index].cards.length === 0) return true;
  else return false;
};

const Kanban = () => {
  // holder ?????? card ???????????? ??????
  const [items, dispatchItems] = useReducer(itemReducer, [
    BoardOne,
    BoardTwo,
    BoardThree
  ]);
  // ???????????? ????????????
  const [dragged, setDragged] = useState(null);
  // ???????????? ????????? ???????????? ?????? ????????????
  const [inserted, setInserted] = useState(null);
  const [status, setStatus] = useState(null);

  const dragOverHandler = (e, flag) => {
    e.stopPropagation();
    const current = e.currentTarget;

    // ????????? ????????? ????????? ???????????? ???????????? ??????
    const targetH = current.getBoundingClientRect().height;
    const cursorH = e.nativeEvent.offsetY;
    const toTopOrBottom = isTopOrBottom(targetH, cursorH);

    // ????????? ?????? holder??? ??????
    let holderNum = current.className.match(/(?<=cardBox-)\d/g);
    // ????????? ?????? card??? ??????
    let itemIndex = current.className.match(/(?<=cardIndex-)\d/g);
    // ????????? ?????? board??? ??????
    let boardIndex = current.className.match(/(?<=boardIndex-)\d/g);
    if (boardIndex !== null) boardIndex = Number(boardIndex);

    if (
      flag === "BACKGROUND" &&
      status === null &&
      isBoardEmpty(items, boardIndex)
    ) {
      setStatus("INSERTED_NEW");
      dispatchItems({
        type: "INSERT",
        thisItem: { ...dragged.value, id: uid(16), tag: "invaild" },
        toThisHolder: boardIndex,
        atThisIndex: 0
      });
      setInserted({ holder: boardIndex, index: 0 });
      return;
    }
    if (flag === "BACKGROUND" && status === "INSERTED_BEFORE") {
      deleteHandler(inserted.holder, inserted.index);
      setInserted(null);
      setStatus(null);
      return;
    }
    if (flag === "BACKGROUND" && status === "INSERTED_AFTER") {
      deleteHandler(inserted.holder, inserted.index);
      setInserted(null);
      setStatus(null);
      return;
    }
    if (flag === "BACKGROUND" && status === "INSERTED_NEW") {
      deleteHandler(inserted.holder, inserted.index);
      setInserted(null);
      setStatus(null);
      return;
    }
    // ????????? ??????, ????????? ????????? ????????? ????????? ??????????????? ?????????????????? ??????
    // ?????? ??????????????? ????????? ?????? ??????
    // ???????????? ??????
    if (holderNum !== null) holderNum = Number(holderNum);
    else return;
    if (itemIndex !== null) itemIndex = Number(itemIndex);
    else return;

    if (toTopOrBottom === "TOP" && status === "INSERTED_AFTER") {
      deleteHandler(inserted.holder, inserted.index);
      setStatus("INSERTED_BEFORE");
      dispatchItems({
        type: "INSERT",
        thisItem: { ...dragged.value, id: uid(16), tag: "invaild" },
        toThisHolder: holderNum,
        atThisIndex: itemIndex
      });
      setInserted({ holder: holderNum, index: itemIndex });
      return;
    }
    if (toTopOrBottom === "BOTTOM" && status === "INSERTED_BEFORE") {
      deleteHandler(inserted.holder, inserted.index);
      setStatus("INSERTED_AFTER");
      dispatchItems({
        type: "INSERT",
        thisItem: { ...dragged.value, id: uid(16), tag: "invaild" },
        toThisHolder: holderNum,
        atThisIndex: itemIndex + 1
      });
      setInserted({ holder: holderNum, index: itemIndex + 1 });
      return;
    }

    // ????????? ??????
    if (status !== null) return;
    if (holderNum === dragged.holder && itemIndex === dragged.index) return;

    if (toTopOrBottom === "TOP") {
      setStatus("INSERTED_BEFORE");
      dispatchItems({
        type: "INSERT",
        thisItem: { ...dragged.value, id: uid(16), tag: "invaild" },
        toThisHolder: holderNum,
        atThisIndex: itemIndex
      });
      setInserted({ holder: holderNum, index: itemIndex });
      return;
    }
    if (toTopOrBottom === "BOTTOM") {
      setStatus("INSERTED_AFTER");
      dispatchItems({
        type: "INSERT",
        thisItem: { ...dragged.value, id: uid(16), tag: "invaild" },
        toThisHolder: holderNum,
        atThisIndex: itemIndex + 1
      });
      setInserted({ holder: holderNum, index: itemIndex + 1 });
      return;
    }
  };

  const dragStartHandler = (e) => {
    const target = e.currentTarget;
    // ???????????? holder??? ??????
    let holderNum = target.className.match(/(?<=cardBox-)\d/g);
    // ???????????? card??? ??????
    let itemIndex = target.className.match(/(?<=cardIndex-)\d/g);
    // ????????? ??????
    if (holderNum === null || itemIndex === null) return;
    // ????????? ?????? ??????
    holderNum = Number(holderNum);
    itemIndex = Number(itemIndex);
    // ???????????? ???????????? ????????? ??????
    const targetCard = items[holderNum].cards[itemIndex];
    setDragged({
      holder: holderNum,
      index: itemIndex,
      value: {
        id: targetCard.id,
        tag: targetCard.tag,
        title: targetCard.title,
        text: targetCard.text
      }
    });
    setTimeout(() => {
      target.style.display = "none";
    }, 1);
  };

  // ???????????? ????????????
  const dragEndHandler = (e) => {
    if (
      status === "INSERTED_BEFORE" ||
      status === "INSERTED_AFTER" ||
      status === "INSERTED_NEW"
    ) {
      items[inserted.holder].cards[inserted.index].tag = "vaild";
      dispatchItems({ type: "DELETE_BY_ID", id: dragged.value.id });
      // ?????? ?????????
      setStatus(null);
      // ???????????? ?????? ?????????
      setDragged(null);
      // ???????????? ?????? ?????? ?????????
      setInserted(null);
    } else {
      e.currentTarget.style.display = "";
      // ???????????? ?????? ?????????
      setDragged(null);
      // ???????????? ?????? ?????? ?????????
      setInserted(null);
      // ?????? ?????????
      setStatus(null);
    }
  };

  const deleteHandler = (card, index) => {
    dispatchItems({ type: "DELETE", holder: card, index: index });
  };

  const addOpenHandler = (index) => {
    const element = document.getElementById(`add-card-toggle-${index}`);
    if (element.style.display === "block") element.style.display = "none";
    else element.style.display = "block";
  };

  const submitHandler = (e, index) => {
    e.preventDefault();
    const newTitle = e.target.title.value;
    const newText = e.target.text.value;
    if (newTitle === "" || newText === "") return;
    dispatchItems({
      type: "ADD_NEW",
      holder: index,
      title: newTitle,
      text: newText
    });
    e.target.title.value = "";
    e.target.text.value = "";
    addOpenHandler(index);
  };

  return (
    <>
      {items.map((board, boardNum) => {
        return (
          <Holder
            key={`${board.title} ${boardNum}`}
            className={`boardIndex-${boardNum}`}
            onDragOver={(e) => dragOverHandler(e, "BACKGROUND")}
          >
            <p className="holder-title">{board.title}</p>
            <span
              className="holder-add"
              onClick={() => addOpenHandler(boardNum)}
            >
              &#43;
            </span>
            <AddCard
              id={`add-card-toggle-${boardNum}`}
              onSubmit={(e) => submitHandler(e, boardNum)}
            >
              <input
                className="add-card-title"
                type="text"
                name="title"
                placeholder="??????"
                autoComplete="false"
              ></input>
              <textarea
                className="add-card-text"
                name="text"
                placeholder="??????"
                autoComplete="false"
              ></textarea>
              <div className="add-card-confirm">
                <input
                  type="submit"
                  value="??????"
                  className="add-card-btn yes"
                ></input>
                <p
                  className="add-card-btn no"
                  onClick={() => addOpenHandler(boardNum)}
                >
                  ??????
                </p>
              </div>
            </AddCard>
            <div className="holder-body">
              {board.cards.map((card, cardNum) => {
                return (
                  <Card
                    key={card.id}
                    className={`cardBox-${boardNum} cardIndex-${cardNum} ${
                      card.tag === "vaild" ? "vaild" : "invaild"
                    }`}
                    onDragStart={dragStartHandler}
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDragOver={(e) => dragOverHandler(e)}
                    draggable="true"
                  >
                    <span
                      className="delete-btn"
                      onClick={() => deleteHandler(boardNum, cardNum)}
                    >
                      &times;
                    </span>
                    <p className="card-title">{card.title}</p>
                    <p className="card-text">{card.text}</p>
                  </Card>
                );
              })}
            </div>
          </Holder>
        );
      })}
    </>
  );
};

export default Kanban;
