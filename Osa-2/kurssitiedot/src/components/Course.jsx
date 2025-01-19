const Header = (props) => (
    <h1>
      {props.course}
    </h1>
  )
  
  const Part = ({id, name, exercises}) => (
    <p>
      {name} {exercises}
    </p>
  )
  
  const Content = ({ parts }) => (
    <>
      {parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
      )}
    </>
  )
  
  const Total = ({ parts }) => {
     return (
      <p>
        <strong>
          Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
        </strong>
      </p>
  )
  }
  
  const Course = (props) => (
    <>
      <Header course={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total parts={props.course.parts}/>
    </>
  )

export default Course