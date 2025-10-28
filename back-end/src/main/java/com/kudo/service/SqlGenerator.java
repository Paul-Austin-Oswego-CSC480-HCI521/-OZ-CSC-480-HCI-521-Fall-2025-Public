package com.kudo.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.kudo.model.Pair ;

//Generates SQL statements with which contain generics
public class SqlGenerator {

    //INSERT INTO table (columns[...]) Values(?)
    public static String getInsert(String table,List<String> columns) {

        StringBuilder sql = new StringBuilder("INSERT INTO " + table + "(");
        for(String c : columns) {
            sql.append(c).append(", ");
        }

        sql.deleteCharAt(sql.length()-2); //drop trailing ', '
        sql.append(") VALUES (");

        sql.append("?, ".repeat(columns.size()));
        sql.deleteCharAt(sql.length()-2); //drop trailing ', '

        return sql.toString();
                //"(email, name, password_hash, role) VALUES (?, ?, ?, ?) RETURNING user_id";

    }

    //INSERT INTO table (columns[...]) Values(?) RETURNING returning[...]
    public static String getInsert(String table, List<String> columns, List<String> returning) {
        StringBuilder sql = new StringBuilder(getInsert(table, columns) + " RETURNING ");

        for(String r : returning) {
            sql.append(r).append(", ");
        }
        sql.deleteCharAt(sql.length()-2); //drop trailing ', '
        return sql.toString();
    }

    //SELECT * FROM table
    public static String getSelect(String table){
        return ("SELECT * FROM ") + table;
    }

    //SELECT selectColumns[...] FROM table
    public static String getSelect(List<String> selectColumns, String table){
        StringBuilder sql = new StringBuilder("SELECT ");

        for(String s : selectColumns) {
            sql.append(s).append(", ");
        }
        sql.deleteCharAt(sql.length()-2); //drop trailing ', '

        sql.append("FROM ").append(table);
        return sql.toString();
    }

    //SELECT selectColumns[...] FROM table WHERE whereColumns[...] = ?
    public static String getSelect(List<String> selectColumns, String table, List<String> whereColumns){
        StringBuilder sql = new StringBuilder(getSelect(selectColumns, table));

        sql.append(" WHERE ");
        for(String w : whereColumns) {
            sql.append(w).append(" = ? AND ");
        }
        sql.deleteCharAt(sql.length()-4); //drop trailing ', '

        return sql.toString();
    }

    //SELECT * FROM table WHERE whereColumns[...] = ?
    public static String getSelect(String table,List<String> whereColumns){
        StringBuilder sql = new StringBuilder(getSelect(table));

        sql.append(" WHERE ");
        for(String w : whereColumns) {
            sql.append(w).append(" = ? AND ");
        }
        sql.deleteCharAt(sql.length()-4); //drop trailing ', '

        return sql.toString();
    }

    public static String getSelect(List<String> selectColumns, String table, List<String> whereColumns, Map<String,Object> filters) {
        StringBuilder sql = new StringBuilder(getSelect(selectColumns, table));
        if (whereColumns.isEmpty()) return sql.toString();

        sql.append(" WHERE ");

        for (String col : whereColumns) {
            Object value = filters.get(col);
            if (value instanceof Collection<?> coll) {
                String placeholders = "?,".repeat(coll.size());
                placeholders = placeholders.substring(0, placeholders.length() - 1); //remove trailing comma
                sql.append(col).append(" IN (").append(placeholders).append("), ");
                sql.delete(sql.length() - 2, sql.length()); //drop trailing ', '
            } else {
                sql.append(col).append("= ? AND ");
                sql.delete(sql.length() - 4, sql.length()); //drop trailing 'AND '
            }
        }
        return sql.toString();
    }

    public static String getSelect(List<String> selectColumns,
                                   List<String> tables,
                                   List<Pair<String, String>> joinOn,
                                   List<String> whereColumns,
                                   Map<String,Object> filters) {
        if (tables == null || tables.isEmpty()) {
            throw new IllegalArgumentException("At least one table required");
        }
        if (joinOn != null && joinOn.size() != tables.size() - 1) {
            throw new IllegalArgumentException("joinOn must have exactly tables.size() - 1 entries");
        }

        StringBuilder sql = new StringBuilder("SELECT ");

        // Build SELECT list
        if (selectColumns == null || selectColumns.isEmpty()) {
            sql.append("*");
        } else {
            sql.append(String.join(", ", selectColumns));
        }

        sql.append(" FROM ");

        // Add first table
        sql.append(tables.get(0));

        // Join subsequent tables using joinOn pairs
        for (int i = 1; i < tables.size(); i++) {
            Pair<String, String> joinCols = joinOn.get(i - 1);
            sql.append(" JOIN ").append(tables.get(i))
                    .append(" ON ").append(joinCols.getKey())
                    .append(" = ").append(joinCols.getValue());
            if (i < tables.size() - 1) sql.append(" ");
        }

        // Add WHERE clause
        if (whereColumns != null && !whereColumns.isEmpty() && filters != null && !filters.isEmpty()) {
            sql.append(" WHERE ");
            for (int i = 0; i < whereColumns.size(); i++) {
                String col = whereColumns.get(i);
                Object value = filters.get(col);
                sql.append(col);

                if (value instanceof Collection<?> coll && !coll.isEmpty()) {
                    // IN clause
                    sql.append(" IN (");
                    sql.append(coll.stream().map(v -> "?").collect(Collectors.joining(",")));
                    sql.append(")");
                } else {
                    // single value
                    sql.append(" = ?");
                }
                if (i < whereColumns.size() - 1) sql.append(" AND ");
            }
        }
        return sql.toString();
    }
}
