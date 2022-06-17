import React, { useCallback, useEffect } from "react";
import {
    deleteItem,
    getAllTag,
    getOneItem,
    saveItem,
    updateItem
} from "services/TagServices";
import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Button, Grid, makeStyles, Paper, TextField } from "@material-ui/core";
import CommonForm from "components/dialog/CommonForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "components/loading/Loading";
import TableData from "components/table/TableData";
import { Search } from "@material-ui/icons";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const columns = [
    { id: "id", label: "ID", minWidth: 170, type: "number", isShow: true },
    { id: "name", label: "Tên tag", minWidth: 170, type: "text", isShow: true },
    { id: "code", label: "Mã tag", minWidth: 170, type: "text", isShow: true },
    { id: "createdDate", label: "Ngày tạo", minWidth: 100, type: "text", isShow: false, },
];

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
    visuallyHidden: {
        display: "none",
    },
    text: {
        fontSize: "1.3rem",
    },
    head: {
        fontSize: "1.5rem",
        background: "#156D90",
        paddingTop: "15px",
        paddingBottom: "15px",
        color: "#fff",
    },
    caption: {
        color: "inherit",
        padding: 8,
        fontSize: "1.3rem",
    },
    toolbar: {
        "& > p:nth-of-type(2)": {
            fontSize: "1.3rem",
            fontWeight: 500,
        },
    },
    textField: {
        fontWeight: 500,
        width: '75%'
    },
    button: {
        marginLeft: 10,
        float: "right",
        height: "100%",
        padding: '14px 21px',
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center'
    }
});

export default function Tags() {
    const [tags, setTags] = useState([]);
    const classes = useStyles();
    const [openDialog, setOpendialog] = useState(false);
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState("");

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const setNewPage = (page) => {
        setPage(page);
    };

    const setNewRowsPerPage = (newRows) => {
        setRowsPerPage(newRows);
        setPage(0);
    };

    const handleChangePage = (newPage) => {
        setNewPage(newPage);
    };

    const handleOpendialog = (id) => {
        if (id) {
            getOneItem(id)
                .then((res) => setItem(res.data))
                .catch((err) => console.log(err));
        } else {
            setItem({});
        }
        setOpendialog(true);
    };

    const handleSaveItem = (data) => {
        const { id } = data;
        if (id) {
            updateItem(data)
                .then((res) => {
                    handleCloseDialog();
                    getData();
                    toast.success("Cập nhật thành công");
                })
                .catch((err) =>
                    toast.error("Cập nhật không thành công")
                );
        } else {
            saveItem(data)
                .then(() => {
                    handleCloseDialog();
                    getData();
                    toast.success("Thêm mới thành công");
                })
                .catch((err) => toast.error("Thêm không thành công"));
        }
    }

    const handleDeleteItem = (id) => {
        deleteItem(id)
            .then(() => {
                getData();
                toast.success("Cập nhật trạng thái thành công");
            })
            .catch((err) => toast.error("Cập nhật trạng thái không thành công"));
    };

    const getData = useCallback(() => {
        let searchObj = {};
        searchObj.limit = rowsPerPage;
        searchObj.page = page;
        searchObj.name = name;
        getAllTag(searchObj)
            .then((res) => {
                setTags([...res.data.content]);
                setTotalElements(res.data.totalElements)
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, [name, page, rowsPerPage]);

    const handleCloseDialog = () => {
        setOpendialog(false);
    };

    useEffect(() => {
        getData();
        document.title = " Admin | Tags";
    }, [getData]);
    return (
        <div>
            <h2 className="page-header">Quản lý tags</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Grid container spacing={3}>
                                <Grid item md={6}>
                                    <div className={classes.wrapper}>
                                        <TextField
                                            className={classes.textField}
                                            id="outlined-basic"
                                            label="Tên..."
                                            variant="outlined"
                                            name="name"
                                            value={name}
                                            fullWidth
                                            onChange={handleChange}
                                            InputProps={{
                                                className: classes.input,
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                            className={classes.button}
                                            startIcon={<Search />}
                                        >
                                            Tìm kiếm
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid item md={6}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        className={classes.button}
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpendialog(null)}
                                    >
                                        Thêm mới
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    {loading ? (
                                        <Loading />
                                    ) : (
                                        <Paper className={classes.root}>
                                            <TableData
                                                data={tags}
                                                columns={columns}
                                                handleOpendialog={handleOpendialog}
                                                handleDeleteItem={handleDeleteItem}
                                                totalElements={totalElements}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onChangePage={handleChangePage}
                                                onChangeRowsPerPage={setNewRowsPerPage}
                                            />
                                        </Paper>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
            <CommonForm
                fields={columns}
                open={openDialog}
                onClose={handleCloseDialog}
                title="Tags"
                item={item}
                onSaveItem={handleSaveItem}
            />
        </div>
    );
}
