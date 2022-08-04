import React from 'react'
import { Tag } from 'antd'

const UnitMinified = ({ unit }) => {
  const { genes, isDead } = unit

  return (
    <Tag
      color={`#${genes}`}
      style={{ opacity: isDead && 0.03, height: 22, width: 60 }}
    >
      {' '}
    </Tag>
  )
}

export default UnitMinified
